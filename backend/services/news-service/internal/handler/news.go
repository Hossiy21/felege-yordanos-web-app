package handlers

import (
	"church-platform/news-service/internal/database"
	"church-platform/news-service/internal/models"
	"church-platform/news-service/internal/utils"
	"context"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func generateSlug(title string) string {
	res := strings.ToLower(title)
	res = regexp.MustCompile(`[^a-z0-9\s-]`).ReplaceAllString(res, "")
	res = regexp.MustCompile(`\s+`).ReplaceAllString(res, "-")
	res = regexp.MustCompile(`-+`).ReplaceAllString(res, "-")
	return strings.Trim(res, "-")
}

func CreateNews(c *gin.Context) {
	var news models.News
	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid news data format"})
		return
	}

	emailVal, _ := c.Get("user_email")
	nameVal, _ := c.Get("user_name")
	roleVal, _ := c.Get("user_role")
	deptVal, _ := c.Get("user_department")
	tenantVal, _ := c.Get("tenant_id")

	email, _ := emailVal.(string)
	name, _ := nameVal.(string)
	role, _ := roleVal.(string)
	dept, _ := deptVal.(string)
	tenant, _ := tenantVal.(string)

	// Admin or News Department can post
	if role != "admin" && dept != "news" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions. Admin or News Department required."})
		return
	}

	news.ID = primitive.NewObjectID()
	news.AuthorEmail = email
	news.AuthorName = name
	news.TenantID = tenant
	news.Slug = generateSlug(news.Title)
	news.CreatedAt = time.Now()
	news.UpdatedAt = time.Now()
	news.DeletedAt = nil

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := database.NewsCollection.InsertOne(ctx, news)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save news to db"})
		return
	}
	c.JSON(http.StatusCreated, news)
}

func GetNewsHandler(c *gin.Context) {
	// Support public access for home page if no tenant is provided
	tenantID := c.Query("tenant_id")
	if tenantID == "" {
		t, _ := c.Get("tenant_id")
		if t != nil {
			tenantID = t.(string)
		}
	}

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	skip := (page - 1) * limit

	filter := bson.M{"deleted_at": nil}
	if tenantID != "" {
		filter["tenant_id"] = tenantID
	}

	// Count total
	total, _ := database.NewsCollection.CountDocuments(c.Request.Context(), filter)

	findOptions := options.Find()
	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(skip))
	findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := database.NewsCollection.Find(c.Request.Context(), filter, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch news"})
		return
	}
	defer cursor.Close(c.Request.Context())

	var newsList []models.News = []models.News{}
	if err = cursor.All(c.Request.Context(), &newsList); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding results"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"news":  newsList,
		"total": total,
		"page":  page,
		"pages": math.Ceil(float64(total) / float64(limit)),
	})
}

func GetNewsBySlugHandler(c *gin.Context) {
	slugOrId := c.Param("slug")

	filter := bson.M{
		"deleted_at": nil,
		"$or": []bson.M{
			{"slug": slugOrId},
		},
	}

	// Try to add ID to the OR filter if it's a valid ObjectID
	if objID, err := primitive.ObjectIDFromHex(slugOrId); err == nil {
		filter["$or"] = append(filter["$or"].([]bson.M), bson.M{"_id": objID})
	}

	var news models.News
	err := database.NewsCollection.FindOne(c.Request.Context(), filter).Decode(&news)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	c.JSON(http.StatusOK, news)
}

func UpdateNews(c *gin.Context) {
	id := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(id)
	tenantID, _ := c.Get("tenant_id")
	nameVal, _ := c.Get("user_name")
	name, _ := nameVal.(string)

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}

	updateData["author_name"] = name
	updateData["updated_at"] = time.Now()
	filter := bson.M{"_id": objID, "tenant_id": tenantID}

	_, err := database.NewsCollection.UpdateOne(c.Request.Context(), filter, bson.M{"$set": updateData})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "News updated"})
}

func DeleteNews(c *gin.Context) {
	id := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(id)
	tenantID, _ := c.Get("tenant_id")

	filter := bson.M{"_id": objID, "tenant_id": tenantID}
	update := bson.M{"$set": bson.M{"deleted_at": time.Now()}}

	_, err := database.NewsCollection.UpdateOne(c.Request.Context(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "News deleted"})
}

func UploadImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image uploaded"})
		return
	}

	// Create unique filename
	ext := filepath.Ext(file.Filename)
	if ext == "" {
		ext = ".jpg"
	}
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	bucketName := os.Getenv("MINIO_BUCKET")
	if bucketName == "" {
		bucketName = "news"
	}

	// Open file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	// Upload to MinIO
	ctx := context.Background()

	// Ensure bucket exists (fallback check)
	exists, err := utils.MinioClient.BucketExists(ctx, bucketName)
	if err != nil {
		log.Printf("ERROR: Failed to check bucket existence: %v", err)
	} else if !exists {
		log.Printf("INFO: Bucket %s does not exist, creating it now...", bucketName)
		err = utils.MinioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Printf("ERROR: Failed to create bucket %s: %v", bucketName, err)
		}
	}

	_, err = utils.MinioClient.PutObject(ctx, bucketName, filename, src, file.Size, minio.PutObjectOptions{
		ContentType: file.Header.Get("Content-Type"),
	})

	if err != nil {
		log.Printf("ERROR: MinIO PutObject FAILED: %v (bucket: %s, file: %s, size: %d, type: %s)",
			err, bucketName, filename, file.Size, file.Header.Get("Content-Type"))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to storage: " + err.Error()})
		return
	}

	log.Printf("SUCCESS: Image uploaded to MinIO: %s/%s", bucketName, filename)

	// Return public URL (Assuming MinIO is on port 9000 and accessible)
	// Or use Gateway URL if you prefer: http://localhost:8000/storage/news/filename
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
