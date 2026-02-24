package handlers

import (
	"church-platform/news-service/internal/database"
	"church-platform/news-service/internal/models"
	// "church-platform/news-service/internal/models"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateNews(c *gin.Context) {
	var news models.News
	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid news data format"})
		return
	}
	email := c.GetHeader("X-User-Email")
	name := c.GetHeader("X-User-Name")
	role := c.GetHeader("X-User-Role")
	if email == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Security Violation"})
		return
	}
	if role != "admin" && role != "user" {
		c.JSON(http.StatusForbidden, gin.H{"error": "You dont have permission"})
		return
	}
	news.AuthorEmail = email
	news.AuthorName = name
	news.DeletedAt = nil

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := database.NewsCollection.InsertOne(ctx, news)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save news to db"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "News Post Created",
		"author":  name,
	})
}

func GetNewsHandler(c *gin.Context) {
	emailValue, exists := c.Get("user_email")
	var userEmail string

	if !exists || emailValue == nil {
		userEmail = "test_user@church.com"
	} else {
		userEmail = emailValue.(string)
	}
	filter := bson.M{"author_email": userEmail, "deleted_at": nil}

	cursor, err := database.NewsCollection.Find(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch news"})
		return
	}
	defer cursor.Close(c.Request.Context())
	var newsList []models.News
	if err = cursor.All(c.Request.Context(), &newsList); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding results"})
		return
	}
	if newsList == nil {
		newsList = []models.News{}

	}
	c.JSON(http.StatusOK, newsList)
}
