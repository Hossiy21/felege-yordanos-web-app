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

	"math"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
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

	tenantValue, _ := c.Get("tenant_id")
	if tenantValue != nil {
		meeting.TenantID = tenantValue.(string)
	}

	log.Printf("DEBUG: Received CreateMeeting request for: %s (Tenant: %s)", meeting.Title, meeting.TenantID)

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
	tenantValue, _ := c.Get("tenant_id")
	tenantID := ""
	if tenantValue != nil {
		tenantID = tenantValue.(string)
	}

	// Pagination and filter parameters
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")
	statusFilter := c.Query("status")
	searchQuery := c.Query("search")
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

	if statusFilter != "" {
		filter["status"] = statusFilter
	}

	if searchQuery != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": searchQuery, "$options": "i"}},
			{"agenda": bson.M{"$regex": searchQuery, "$options": "i"}},
		}
	}

	// Get total count for pagination
	total, err := database.MeetingCollection.CountDocuments(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count meetings"})
		return
	}

	findOptions := options.Find()
	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(skip))
	findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := database.MeetingCollection.Find(context.TODO(), filter, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch meetings"})
		return
	}
	defer cursor.Close(context.TODO())

	var meetings []models.Meeting = []models.Meeting{}
	if err := cursor.All(context.TODO(), &meetings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing meetings"})
		return
	}

	// Dynamic stats aggregation
	pipeline := bson.A{
		bson.M{"$match": bson.M{"tenant_id": tenantID, "deleted_at": nil}},
		bson.M{"$group": bson.M{
			"_id":             nil,
			"upcoming":        bson.M{"$sum": bson.M{"$cond": bson.A{bson.M{"$eq": bson.A{"$status", "Upcoming"}}, 1, 0}}},
			"total_decisions": bson.M{"$sum": "$decisions"},
			"emergencies":     bson.M{"$sum": bson.M{"$cond": bson.A{bson.M{"$eq": bson.A{"$is_emergency", true}}, 1, 0}}},
		}},
	}

	statsCursor, err := database.MeetingCollection.Aggregate(context.TODO(), pipeline)
	var stats bson.M = bson.M{"upcoming": 0, "total_decisions": 0, "emergencies": 0}

	if err == nil && statsCursor != nil {
		var statsResult []bson.M
		if err := statsCursor.All(context.TODO(), &statsResult); err == nil && len(statsResult) > 0 {
			stats = statsResult[0]
		}
		statsCursor.Close(context.TODO())
	}

	c.JSON(http.StatusOK, gin.H{
		"meetings": meetings,
		"total":    total,
		"page":     page,
		"limit":    limit,
		"pages":    math.Ceil(float64(total) / float64(limit)),
		"stats":    stats,
	})
}

func UpdateMeetingHandler(c *gin.Context) {
	id := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(id)
	tenantValue, _ := c.Get("tenant_id")
	tenantID := ""
	if tenantValue != nil {
		tenantID = tenantValue.(string)
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Update Data"})
		return
	}

	updateData["updated_at"] = time.Now()

	filter := bson.M{"_id": objID, "tenant_id": tenantID}
	_, err := database.MeetingCollection.UpdateOne(
		context.TODO(),
		filter,
		bson.M{"$set": updateData},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Meeting updated"})
}

func DeleteMeetingHandler(c *gin.Context) {
	id := c.Param("id")
	objID, _ := primitive.ObjectIDFromHex(id)
	tenantValue, _ := c.Get("tenant_id")
	tenantID := ""
	if tenantValue != nil {
		tenantID = tenantValue.(string)
	}

	// Soft delete
	filter := bson.M{"_id": objID, "tenant_id": tenantID}
	update := bson.M{
		"$set": bson.M{
			"deleted_at": time.Now(),
			"updated_at": time.Now(),
		},
	}

	_, err := database.MeetingCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Meeting moved to trash"})
}
