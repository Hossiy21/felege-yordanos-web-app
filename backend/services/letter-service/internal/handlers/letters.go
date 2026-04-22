package handlers

import (
	"context"
	"fmt"
	"io"
	"math"
	"net/http"
	"os"
	"time"

	"church-platform/letter-service/internal/database"
	"church-platform/letter-service/internal/models"
	"church-platform/letter-service/internal/utils"

	"log"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateLetterHandler(c *gin.Context) {
	emailValue, _ := c.Get("user_email")
	tenantValue, _ := c.Get("tenant_id")
	var userEmail string
	var tenantID string

	if emailValue == nil {
		userEmail = "test_user@church.com"
	} else {
		userEmail = emailValue.(string)
	}

	if tenantValue == nil {
		tenantID = "default"
	} else {
		tenantID = tenantValue.(string)
	}

	var referenceNo, letterType, subject, deptName, pdfUrl string
	var deptId int

	contentType := c.GetHeader("Content-Type")
	log.Printf("Received CreateLetter request. Content-Type: %s", contentType)

	if strings.Contains(contentType, "multipart/form-data") {
		referenceNo = c.PostForm("reference_number")
		letterType = c.PostForm("letter_type")
		subject = c.PostForm("subject")
		deptName = c.PostForm("department_name")
		deptId, _ = strconv.Atoi(c.PostForm("department_id"))

		log.Printf("Parsing MultipartForm: Ref=%s, Subj=%s, Dept=%s", referenceNo, subject, deptName)

		file, err := c.FormFile("pdf")
		if err == nil {
			uniqueID := primitive.NewObjectID().Hex()
			fileName := fmt.Sprintf("%s.pdf", uniqueID)

			src, err := file.Open()
			if err != nil {
				log.Printf("Error opening uploaded file: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process PDF"})
				return
			}
			defer src.Close()

			bucket := os.Getenv("MINIO_BUCKET")
			if bucket == "" {
				bucket = "incoming-letters"
			}

			_, err = utils.MinioClient.PutObject(context.Background(), bucket, fileName, src, file.Size, minio.PutObjectOptions{
				ContentType:        "application/pdf",
				ContentDisposition: "inline",
			})
			if err != nil {
				log.Printf("Minio Upload Error: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to file server"})
				return
			}
			pdfUrl = "http://localhost:9000/" + bucket + "/" + fileName
		} else {
			log.Printf("No PDF file provided in multipart request (optional).")
		}
	} else {
		log.Printf("Attempting JSON binding...")
		var input struct {
			ReferenceNumber string `json:"reference_number"`
			LetterType      string `json:"letter_type"`
			Subject         string `json:"subject"`
			DepartmentId    int    `json:"department_id"`
			DepartmentName  string `json:"department_name"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			log.Printf("JSON bind error: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Format"})
			return
		}
		referenceNo = input.ReferenceNumber
		letterType = input.LetterType
		subject = input.Subject
		deptName = input.DepartmentName
		deptId = input.DepartmentId
	}

	newLetter := models.Letter{
		ID:              primitive.NewObjectID(),
		ReferenceNumber: referenceNo,
		Subject:         subject,
		LetterType:      letterType,
		Status:          "pending",
		DepartmentID:    deptId,
		DepartmentName:  deptName,
		OwnerEmail:      userEmail,
		TenantID:        tenantID,
		PdfUrl:          pdfUrl,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
		DeletedAt:       nil,
	}
	_, err := database.LetterCollection.InsertOne(context.TODO(), newLetter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Letter Saved", "id": newLetter.ID.Hex(), "pdf_url": pdfUrl})
}

func GetLettersHander(c *gin.Context) {
	emailValue, _ := c.Get("user_email")
	roleValue, _ := c.Get("user_role")
	tenantValue, _ := c.Get("tenant_id")

	var userEmail string
	var userRole string
	var tenantID string = "default"

	if emailValue == nil {
		userEmail = "test_user@church.com"
	} else {
		userEmail = emailValue.(string)
	}

	if roleValue == nil {
		userRole = "user"
	} else {
		userRole = roleValue.(string)
	}

	if tenantValue != nil {
		tenantID = tenantValue.(string)
	}

	// Pagination parameters
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")
	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	skip := (page - 1) * limit

	filter := bson.M{
		"tenant_id":  tenantID,
		"deleted_at": nil,
	}
	if userRole != "admin" {
		filter["owner_email"] = userEmail
	}

	// Optional letter_type filter: ?type=incoming or ?type=outgoing
	if letterType := c.Query("type"); letterType != "" {
		filter["letter_type"] = letterType
	}

	// Get total count for pagination
	total, err := database.LetterCollection.CountDocuments(context.TODO(), filter)
	if err != nil {
		log.Printf("GetLetters: CountDocuments error: %v, filter: %+v", err, filter)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count documents"})
		return
	}
	log.Printf("GetLetters: Found total %d for tenant %s", total, tenantID)

	findOptions := options.Find()
	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(skip))
	findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}}) // Use D for ordered sort

	cursor, err := database.LetterCollection.Find(context.TODO(), filter, findOptions)
	if err != nil {
		log.Printf("GetLetters: Find error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Query failed"})
		return
	}
	defer cursor.Close(context.TODO())

	letters := []models.Letter{}
	if err := cursor.All(context.TODO(), &letters); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Data parsing error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"letters": letters,
		"total":   total,
		"page":    page,
		"limit":   limit,
		"pages":   math.Ceil(float64(total) / float64(limit)),
	})
}

func UpdateLetterHandler(c *gin.Context) {
	letterIdStr := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(letterIdStr)
	tenantValue, _ := c.Get("tenant_id")
	emailValue, _ := c.Get("user_email")
	roleValue, _ := c.Get("user_role")

	tenantID := "default"
	if tenantValue != nil {
		tenantID = tenantValue.(string)
	}
	userEmail := ""
	if emailValue != nil {
		userEmail = emailValue.(string)
	}
	userRole := ""
	if roleValue != nil {
		userRole = roleValue.(string)
	}

	// 1. Find existing to check ownership
	var existing models.Letter
	err := database.LetterCollection.FindOne(context.TODO(), bson.M{"_id": objID, "tenant_id": tenantID}).Decode(&existing)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Letter not found or access denied"})
		return
	}

	// 2. Check Permissions
	if userRole != "admin" && existing.OwnerEmail != userEmail {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to update this correspondence"})
		return
	}

	// 3. Check if Soft Deleted
	if existing.DeletedAt != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot update a trashed letter. Restore it first."})
		return
	}

	var input struct {
		Subject         string `form:"subject"`
		ReferenceNumber string `form:"reference_number"`
		LetterType      string `form:"letter_type"`
		DepartmentID    string `form:"department_id"`
		DepartmentName  string `form:"department_name"`
		Status          string `form:"status"`
	}
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form data"})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"subject":          input.Subject,
			"reference_number": input.ReferenceNumber,
			"letter_type":      input.LetterType,
			"department_name":  input.DepartmentName,
			"status":           input.Status,
			"updated_at":       time.Now(),
		},
	}

	if input.DepartmentID != "" {
		did, _ := strconv.Atoi(input.DepartmentID)
		update["$set"].(bson.M)["department_id"] = did
	}

	_, err = database.LetterCollection.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save updates"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Letter Updated"})
}

func DeleteLetterHandler(c *gin.Context) {
	letterIdStr := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(letterIdStr)
	tenantValue, _ := c.Get("tenant_id")
	emailValue, _ := c.Get("user_email")
	roleValue, _ := c.Get("user_role")

	tenantID := "default"
	if tenantValue != nil {
		tenantID = tenantValue.(string)
	}
	userEmail := ""
	if emailValue != nil {
		userEmail = emailValue.(string)
	}
	userRole := ""
	if roleValue != nil {
		userRole = roleValue.(string)
	}

	// 1. Find existing
	var existing models.Letter
	err := database.LetterCollection.FindOne(context.TODO(), bson.M{"_id": objID, "tenant_id": tenantID}).Decode(&existing)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Letter not found"})
		return
	}

	// 2. Check Permissions
	if userRole != "admin" && existing.OwnerEmail != userEmail {
		c.JSON(http.StatusForbidden, gin.H{"error": "You cannot delete correspondence belonging to another user"})
		return
	}

	update := bson.M{"$set": bson.M{"deleted_at": time.Now()}}
	_, err = database.LetterCollection.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to move to trash"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Letter moved to trash successfully"})
}

func GetTrashLetterHandler(c *gin.Context) {
	val, _ := c.Get("user_email")
	userEmail := "guest_tester@church.com"

	if val != nil {
		userEmail = val.(string)
	}
	filter := bson.M{
		"owner_email": userEmail,
		"deleted_at":  bson.M{"$ne": nil},
	}
	cursor, err := database.LetterCollection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch trash letters."})
		return
	}
	defer cursor.Close(context.TODO())
	var trashedLetters []models.Letter
	if err = cursor.All(context.TODO(), &trashedLetters); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing trash"})
		return
	}
	c.JSON(http.StatusOK, trashedLetters)
}

// PdfProxyHandler fetches a PDF from MinIO server-side and streams it to the browser.
// This sidesteps any browser CORS restrictions since the browser talks to our own API.
// Usage: GET /letters/pdf-proxy?key=<object-name-in-bucket>
func PdfProxyHandler(c *gin.Context) {
	objectKey := c.Query("key")
	if objectKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing key query param"})
		return
	}

	// 1. Ownership & Permission check
	// We check if a letter exists with this PDF key that belongs to this tenant and user (unless admin)
	tenantValue, _ := c.Get("tenant_id")
	emailValue, _ := c.Get("user_email")
	roleValue, _ := c.Get("user_role")

	tenantID := "default"
	if tenantValue != nil {
		tenantID = tenantValue.(string)
	}
	userEmail := ""
	if emailValue != nil {
		userEmail = emailValue.(string)
	}
	userRole := ""
	if roleValue != nil {
		userRole = roleValue.(string)
	}

	filter := bson.M{
		"tenant_id": tenantID,
		"pdf_url":   bson.M{"$regex": objectKey}, // Check if the stored URL contains this key
	}

	// If not admin, they must be the owner
	if userRole != "admin" {
		filter["owner_email"] = userEmail
	}

	var letter models.Letter
	err := database.LetterCollection.FindOne(context.TODO(), filter).Decode(&letter)
	if err != nil {
		log.Printf("Security Block: User %s attempted to access PDF %s without valid letter record", userEmail, objectKey)
		c.JSON(http.StatusForbidden, gin.H{"error": "Access Denied: You do not have permission to view this document"})
		return
	}

	// 2. Fetch from MinIO (now that we know they have a letter)
	bucket := os.Getenv("MINIO_BUCKET")
	if bucket == "" {
		bucket = "incoming-letters"
	}

	obj, err := utils.MinioClient.GetObject(context.Background(), bucket, objectKey, minio.GetObjectOptions{})
	if err != nil {
		log.Printf("PdfProxy: GetObject error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch PDF from storage"})
		return
	}
	defer obj.Close()

	stat, err := obj.Stat()
	if err != nil {
		log.Printf("PdfProxy: Stat error: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "PDF not found"})
		return
	}

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", fmt.Sprintf(`inline; filename="%s"`, objectKey))
	c.Header("Content-Length", fmt.Sprintf("%d", stat.Size))
	c.Header("Cache-Control", "private, max-age=3600")
	c.Header("X-Content-Type-Options", "nosniff")
	c.Status(http.StatusOK)

	if _, err := io.Copy(c.Writer, obj); err != nil {
		log.Printf("PdfProxy: stream error: %v", err)
	}
}
