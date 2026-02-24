package handlers

import (
	"context"
	"net/http"
	"time"

	"church-platform/letter-service/internal/database"
	"church-platform/letter-service/internal/models"

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
	// userEmail, _ := c.Get("user_email")
	emailValue, exists := c.Get("user_email")

	var userEmail string
	if !exists || emailValue == nil {
		// This is what we use when testing with Thunder Client
		userEmail = "test_user@church.com"
	} else {
		// Only convert to string if we know it exists
		userEmail = emailValue.(string)
	}
	var input struct {
		ReferenceNumber string `json:"reference_number"`
		LetterType      string `json:"letter_type"`
		Subject         string `json:"subject"`
		DepartmentId    int    `json:"department_id"`
		DepartmentName  string `json:"department_name"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Json Format"})
		return
	}
	newLetter := Letter{
		ID:              primitive.NewObjectID(),
		ReferenceNumber: input.ReferenceNumber,
		Subject:         input.Subject,
		Status:          "pending",
		DepartmentID:    input.DepartmentId,
		DepartmentName:  input.DepartmentName,
		OwnerEmail:      userEmail,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
		DeletedAt:       nil,
	}
	_, err := database.LetterCollection.InsertOne(context.TODO(), newLetter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Letter Saved to MongoDB"})
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
