package handlers

import (
	"church-platform/news-service/internal/database"
	"church-platform/news-service/internal/models"
	"church-platform/news-service/internal/utils"
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateGalleryItem(c *gin.Context) {
	var item models.GalleryItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid gallery data format"})
		return
	}

	roleVal, _ := c.Get("user_role")
	deptVal, _ := c.Get("user_department")
	tenantVal, _ := c.Get("tenant_id")

	role, _ := roleVal.(string)
	dept, _ := deptVal.(string)
	tenant, _ := tenantVal.(string)

	if role != "admin" && dept != "news" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions. Admin or News Department required."})
		return
	}

	item.ID = primitive.NewObjectID()
	item.TenantID = tenant
	item.CreatedAt = time.Now()
	item.UpdatedAt = time.Now()
	item.DeletedAt = nil

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := database.GalleryCollection.InsertOne(ctx, item)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save gallery item to database"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func GetGalleryItems(c *gin.Context) {
	tenantID := c.Query("tenant_id")
	if tenantID == "" {
		t, _ := c.Get("tenant_id")
		if t != nil {
			tenantID = t.(string)
		}
	}

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	skip := (page - 1) * limit

	filter := bson.M{"deleted_at": nil}
	if tenantID != "" {
		filter["tenant_id"] = tenantID
	}

	total, _ := database.GalleryCollection.CountDocuments(c.Request.Context(), filter)
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}})
	findOptions.SetSkip(int64(skip))
	findOptions.SetLimit(int64(limit))

	cursor, err := database.GalleryCollection.Find(c.Request.Context(), filter, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch gallery items"})
		return
	}
	defer cursor.Close(c.Request.Context())

	var items = make([]models.GalleryItem, 0)
	for cursor.Next(c.Request.Context()) {
		var item models.GalleryItem
		if err := cursor.Decode(&item); err == nil {
			items = append(items, item)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"items": items,
		"total": total,
		"page":  page,
		"limit": limit,
		"pages": (total + int64(limit) - 1) / int64(limit),
	})
}

func DeleteGalleryItem(c *gin.Context) {
	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid gallery item ID"})
		return
	}

	roleVal, _ := c.Get("user_role")
	deptVal, _ := c.Get("user_department")

	role, _ := roleVal.(string)
	dept, _ := deptVal.(string)

	if role != "admin" && dept != "news" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions. Admin or News Department required."})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{"$set": bson.M{"deleted_at": time.Now()}}
	result, err := database.GalleryCollection.UpdateByID(ctx, id, update)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete gallery item"})
		return
	}

	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gallery item not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Gallery item deleted successfully"})
}

func UploadGalleryImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image uploaded"})
		return
	}

	importPathExt := filepath.Ext(file.Filename)
	if importPathExt == "" {
		importPathExt = ".jpg"
	}
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), importPathExt)
	bucketName := "gallery"

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	ctx := context.Background()

	exists, err := utils.MinioClient.BucketExists(ctx, bucketName)
	if err != nil {
		fmt.Printf("ERROR: Failed to check bucket existence: %v\n", err)
	} else if !exists {
		err = utils.MinioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			fmt.Printf("ERROR: Failed to create bucket %s: %v\n", bucketName, err)
		}
	}

	_, err = utils.MinioClient.PutObject(ctx, bucketName, filename, src, file.Size, minio.PutObjectOptions{
		ContentType: file.Header.Get("Content-Type"),
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to storage: " + err.Error()})
		return
	}

	storageURL := os.Getenv("STORAGE_URL")
	if storageURL == "" {
		storageURL = "http://localhost:9000"
	}

	imageURL := fmt.Sprintf("%s/%s/%s", storageURL, bucketName, filename)
	c.JSON(http.StatusOK, gin.H{
		"message":   "Image uploaded successfully",
		"image_url": imageURL,
	})
}
