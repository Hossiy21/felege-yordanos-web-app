package main

import (
	"log"
	"os"

	"church-platform/meeting-service/internal/database"
	"church-platform/meeting-service/internal/handlers"
	"church-platform/meeting-service/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	database.InitMongo()

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Meeting service is healthy"})
	})

	r.Use(middleware.AuthMiddleware())

	r.GET("/meetings", handlers.GetMeetingsHandler)
	r.POST("/meetings", handlers.CreateMeetingHandler)
	r.PUT("/meetings/:id", handlers.UpdateMeetingHandler)
	r.DELETE("/meetings/:id", handlers.DeleteMeetingHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	log.Printf("Meeting Service running on port %s", port)
	r.Run(":" + port)
}
