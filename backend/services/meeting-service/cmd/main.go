package main

import (
	"log"
	"os"

	"church-platform/meeting-service/internal/database"
	"church-platform/meeting-service/internal/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	database.InitMongo()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/meetings", handlers.GetMeetingsHandler)
	r.POST("/meetings", handlers.CreateMeetingHandler)
	r.PUT("/meetings/:id", handlers.UpdateMeetingHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	log.Printf("Meeting Service running on port %s", port)
	r.Run(":" + port)
}
