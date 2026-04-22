package main

import (
	"church-platform/news-service/internal/database"
	handlers "church-platform/news-service/internal/handler"
	"church-platform/news-service/internal/middleware"
	"church-platform/news-service/internal/utils"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	database.InitMongo()
	utils.InitMinio()
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "News Service is healthy"})
	})

	// Public routes
	r.GET("/news", handlers.GetNewsHandler)
	r.GET("/news/:slug", handlers.GetNewsBySlugHandler)
	r.GET("/gallery", handlers.GetGalleryItems)

	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/news", handlers.CreateNews)
		protected.POST("/upload", handlers.UploadImage)
		protected.PUT("/news/:id", handlers.UpdateNews)
		protected.DELETE("/news/:id", handlers.DeleteNews)

		protected.POST("/gallery", handlers.CreateGalleryItem)
		protected.POST("/gallery/upload", handlers.UploadGalleryImage)
		protected.DELETE("/gallery/:id", handlers.DeleteGalleryItem)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "9001"
	}
	r.Run(":" + port)
}
