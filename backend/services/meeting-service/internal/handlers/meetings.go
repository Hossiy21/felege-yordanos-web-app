package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"church-platform/meeting-service/internal/database"
	"church-platform/meeting-service/internal/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SendTelegramNotification(meeting models.Meeting) {
	botToken := os.Getenv("TELEGRAM_BOT_TOKEN")
	chatID := os.Getenv("TELEGRAM_CHAT_ID") // Can be a group ID (e.g., -100...)

	if botToken == "" || chatID == "" {
		log.Println("Telegram Bot Token or Chat ID not set, skipping notification")
		return
	}

	emoji := "📅"
	if meeting.IsEmergency {
		emoji = "🚨 EMERGENCY"
	}

	text := fmt.Sprintf(
		"%s New Meeting Scheduled\n\nTitle: %s\nDate: %s\nTime: %s\nType: %s\n\nAgenda: %s",
		emoji,
		meeting.Title,
		meeting.Date,
		meeting.Time,
		meeting.Type,
		meeting.Agenda,
	)

	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", botToken)
	payload := map[string]string{
		"chat_id": chatID,
		"text":    text,
	}

	jsonPayload, _ := json.Marshal(payload)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		log.Printf("Failed to send Telegram notification: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var body map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&body)
		log.Printf("Telegram API Error (Status %d): %v", resp.StatusCode, body)
	} else {
		log.Println("Telegram notification sent successfully")
	}
}

func CreateMeetingHandler(c *gin.Context) {
	var meeting models.Meeting
	if err := c.ShouldBindJSON(&meeting); err != nil {
		log.Printf("ERROR: CreateMeeting JSON Bind Failed: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON mapping: " + err.Error()})
		return
	}

	log.Printf("DEBUG: Received CreateMeeting request for: %s", meeting.Title)

	meeting.ID = primitive.NewObjectID()
	meeting.CreatedAt = time.Now()
	meeting.UpdatedAt = time.Now()
	if meeting.Status == "" {
		meeting.Status = "Upcoming"
	}

	_, err := database.MeetingCollection.InsertOne(context.TODO(), meeting)
	if err != nil {
		log.Printf("ERROR: CreateMeeting DB Insertion Failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database persistence failure"})
		return
	}

	log.Printf("SUCCESS: Meeting created with ID: %s", meeting.ID.Hex())

	// Send notification in a goroutine so it doesn't block the response
	go SendTelegramNotification(meeting)

	c.JSON(http.StatusCreated, meeting)
}

func GetMeetingsHandler(c *gin.Context) {
	cursor, err := database.MeetingCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch meetings"})
		return
	}
	defer cursor.Close(context.TODO())

	var meetings []models.Meeting
	if err := cursor.All(context.TODO(), &meetings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing meetings"})
		return
	}

	c.JSON(http.StatusOK, meetings)
}

func UpdateMeetingHandler(c *gin.Context) {
	id := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(id)

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Update Data"})
		return
	}

	updateData["updated_at"] = time.Now()

	_, err := database.MeetingCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$set": updateData},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Meeting updated"})
}
