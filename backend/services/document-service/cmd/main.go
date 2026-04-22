package main

import (
	"log"
	"os"

	"church-platform/document-service/internal/database"
	"church-platform/document-service/internal/handlers"
	"church-platform/document-service/internal/middleware"
	"church-platform/document-service/internal/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		godotenv.Load("../.env")
	}

	utils.InitMinio()
	database.InitDB()

	r := gin.Default()

	// CORS config
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "X-User-Email", "X-User-Role", "X-Tenant-ID"}
	r.Use(cors.New(config))
	r.Use(middleware.AuthMiddleware())

	api := r.Group("/")
	{
		api.POST("/upload", handlers.UploadDocument)
		api.GET("/", handlers.GetDocuments)
		api.PUT("/:id", handlers.UpdateDocument)
		api.DELETE("/:id", handlers.DeleteDocument)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	log.Printf("Document Service running on port %s", port)
	r.Run(":" + port)
}
