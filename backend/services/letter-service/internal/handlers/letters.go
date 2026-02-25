package handlers

import (
	"context"
	"net/http"
	"time"

	"church-platform/letter-service/internal/database"
	"church-platform/letter-service/internal/models"

	"log"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Letter struct {
	ID              primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ReferenceNumber string             `json:"reference_number" bson:"reference_number"`
	Subject         string             `json:"subject" bson:"subject"`
	LetterType      string             `json:"letter_type" bson:"letter_type"`
	Status          string             `json:"status" bson:"status"`
	DepartmentID    int                `json:"department_id" bson:"department_id"`
	DepartmentName  string             `json:"department_name" bson:"department_name"`
	OwnerEmail      string             `json:"owner_email" bson:"owner_email"`
	CreatedAt       time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt       time.Time          `json:"updated_at" bson:"updated_at"`
	DeletedAt       *time.Time         `json:"deleted_at" bson:"deleted_at"`
}

func CreateLetterHandler(c *gin.Context) {
	emailValue, exists := c.Get("user_email")
	var userEmail string
	if !exists || emailValue == nil {
		userEmail = "test_user@church.com"
	} else {
		userEmail = emailValue.(string)
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
			filename := primitive.NewObjectID().Hex() + ".pdf"
			savePath := "./uploads/" + filename
			log.Printf("Saving PDF to: %s", savePath)
			if err := c.SaveUploadedFile(file, savePath); err != nil {
				log.Printf("Error saving file: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
				return
			}
			pdfUrl = "/api/letter/uploads/" + filename
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
	c.JSON(http.StatusCreated, gin.H{"message": "Letter Saved", "pdf_url": pdfUrl})
}

func GetLettersHander(c *gin.Context) {
	emailValue, emailExists := c.Get("user_email")
	roleValue, _ := c.Get("user_role")

	var userEmail string
	var userRole string

	if !emailExists || emailValue == nil {
		userEmail = "test_user@church.com" // Must match the POST handler!
		userRole = "admin"                 // Default to admin for testing
	} else {
		userEmail = emailValue.(string)
		userRole = roleValue.(string)
	}
	filter := bson.M{

		"deleted_at": nil}
	if userRole != "admin" {
		filter["owner_email"] = userEmail
	}
	cursor, err := database.LetterCollection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Query failed"})
		return
	}
	defer cursor.Close(context.TODO())

	letters := []models.Letter{}
	if err := cursor.All(context.TODO(), &letters); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Data parsing error"})
		return
	}
	c.JSON(http.StatusOK, letters)
}

func UpdateLetterHandler(c *gin.Context) {
	letterIdStr := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(letterIdStr)
	userEmail, _ := c.Get("user_email")
	userRole, _ := c.Get("user_role")

	var input struct {
		Subject    string `json:"subject"`
		LetterType string `json:"letter_type"`
	}
	c.ShouldBindJSON(&input)
	filter := bson.M{"_id": objID}
	if userRole != "admin" {
		filter["owner_email"] = userEmail
	}

	update := bson.M{
		"$set": bson.M{
			"subject":     input.Subject,
			"letter_type": input.LetterType,
			"updated_at":  time.Now(),
		},
	}
	_, err := database.LetterCollection.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Letter Updated"})

}

func DeleteLetterHandler(c *gin.Context) {
	letterIdStr := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(letterIdStr)

	filter := bson.M{"_id": objID}
	update := bson.M{"$set": bson.M{"deleted_at": time.Now()}}
	_, err := database.LetterCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not move to trash"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Letter Moved to t"})

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
	var trashedLetters []Letter
	if err = cursor.All(context.TODO(), &trashedLetters); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing trash"})
		return
	}
	c.JSON(http.StatusOK, trashedLetters)
}
