package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"church-platform/document-service/internal/database"
	"church-platform/document-service/internal/models"
	"church-platform/document-service/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UploadDocument(c *gin.Context) {
	emailVal, _ := c.Get("user_email")
	tenantVal, _ := c.Get("tenant_id")
	
	ownerEmail := "guest@church.com"
	if emailVal != nil {
		ownerEmail = emailVal.(string)
	}
	tenantID := "default"
	if tenantVal != nil {
		tenantID = tenantVal.(string)
	}

	log.Printf("Upload request from: %s, tenant: %s", ownerEmail, tenantID)

	description := c.PostForm("description")
	title := c.PostForm("title")
	category := c.PostForm("category")
	docDateStr := c.PostForm("document_date")
	
	docDate := time.Now()
	if docDateStr != "" {
		if parsed, err := time.Parse("2006-01-02", docDateStr); err == nil {
			docDate = parsed
		}
	}

	file, err := c.FormFile("file")
	if err != nil {
		log.Printf("FormFile error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	if title == "" {
		title = file.Filename
	}

	uniqueID := primitive.NewObjectID().Hex()
	fileName := fmt.Sprintf("%s-%s", uniqueID, file.Filename)

	src, err := file.Open()
	if err != nil {
		log.Printf("File open error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	bucket := os.Getenv("MINIO_BUCKET")
	if bucket == "" {
		bucket = "church-documents"
	}

	log.Printf("Uploading %s to bucket %s", fileName, bucket)
	_, err = utils.MinioClient.PutObject(context.Background(), bucket, fileName, src, file.Size, minio.PutObjectOptions{
		ContentType: file.Header.Get("Content-Type"),
	})
	if err != nil {
		log.Printf("Minio upload error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to storage"})
		return
	}

	// Use gateway URL if possible, otherwise fallback to localhost:9000
	storageURL := os.Getenv("STORAGE_BASE_URL")
	if storageURL == "" {
		storageURL = "http://localhost:9000"
	}
	url := fmt.Sprintf("%s/%s/%s", storageURL, bucket, fileName)

	newDoc := models.Document{
		ID:           primitive.NewObjectID(),
		Title:        title,
		Name:         fileName,
		FileType:     file.Header.Get("Content-Type"),
		FileSize:     file.Size,
		URL:          url,
		OwnerEmail:   ownerEmail,
		TenantID:     tenantID,
		Description:  description,
		Category:     category,
		DocumentDate: docDate,
		CreatedAt:    time.Now(),
	}

	log.Printf("Inserting document into DB: %s", title)
	_, err = database.DocumentCollection.InsertOne(context.TODO(), newDoc)
	if err != nil {
		log.Printf("DB insert error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	log.Printf("Upload successful: %s", title)
	utils.RecordAudit(ownerEmail, fmt.Sprintf("Uploaded document: %s", title))
	c.JSON(http.StatusCreated, gin.H{"message": "Document uploaded successfully", "document": newDoc})
}

func GetDocuments(c *gin.Context) {
	tenant, _ := c.Get("tenant_id")
	tenantID := tenant.(string)

	cursor, err := database.DocumentCollection.Find(context.TODO(), bson.M{"tenant_id": tenantID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch documents"})
		return
	}
	defer cursor.Close(context.TODO())

	documents := []models.Document{}
	if err := cursor.All(context.TODO(), &documents); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Parsing error"})
		return
	}

	c.JSON(http.StatusOK, documents)
}

func DeleteDocument(c *gin.Context) {
	id := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(id)
	tenant, _ := c.Get("tenant_id")
	tenantID := tenant.(string)

	// 1. Find document to get filename for MinIO deletion
	var doc models.Document
	err := database.DocumentCollection.FindOne(context.TODO(), bson.M{"_id": objID, "tenant_id": tenantID}).Decode(&doc)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	// 2. Delete from MinIO
	bucket := os.Getenv("MINIO_BUCKET")
	if bucket == "" {
		bucket = "church-documents"
	}
	err = utils.MinioClient.RemoveObject(context.Background(), bucket, doc.Name, minio.RemoveObjectOptions{})
	if err != nil {
		// Log error but continue with DB deletion? 
		// Or fail? Usually better to fail if storage can't be cleaned up, 
		// but DB is the source of truth for the app.
		fmt.Printf("Warning: Failed to delete %s from MinIO: %v\n", doc.Name, err)
	}

	// 3. Delete from MongoDB
	_, err = database.DocumentCollection.DeleteOne(context.TODO(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete document from database"})
		return
	}

	email, _ := c.Get("user_email")
	utils.RecordAudit(fmt.Sprintf("%v", email), fmt.Sprintf("Deleted document: %s", doc.Title))
	c.JSON(http.StatusOK, gin.H{"message": "Document deleted successfully"})
}

func UpdateDocument(c *gin.Context) {
	id := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(id)
	tenant, _ := c.Get("tenant_id")
	tenantID := tenant.(string)

	var input struct {
		Title        string `json:"title"`
		Description  string `json:"description"`
		Category     string `json:"category"`
		DocumentDate string `json:"document_date"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	update := bson.M{}
	if input.Title != "" {
		update["title"] = input.Title
	}
	if input.Description != "" {
		update["description"] = input.Description
	}
	if input.Category != "" {
		update["category"] = input.Category
	}
	if input.DocumentDate != "" {
		if parsed, err := time.Parse("2006-01-02", input.DocumentDate); err == nil {
			update["document_date"] = parsed
		}
	}

	if len(update) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	_, err := database.DocumentCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID, "tenant_id": tenantID},
		bson.M{"$set": update},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update document"})
		return
	}

	email, _ := c.Get("user_email")
	utils.RecordAudit(fmt.Sprintf("%v", email), fmt.Sprintf("Updated document metadata: %s", input.Title))

	c.JSON(http.StatusOK, gin.H{"message": "Document updated successfully"})
}
