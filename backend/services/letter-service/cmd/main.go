package main

import (
	"church-platform/letter-service/internal/database"
	"church-platform/letter-service/internal/handlers"
	"church-platform/letter-service/internal/middleware"
	"log"

	"church-platform/letter-service/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env found, using system variables")
	}
	database.InitMongo()
	utils.InitMinio()
	r := gin.Default()
	r.Use(middleware.AuthMiddleware())
	r.POST("/letters", handlers.CreateLetterHandler)
	r.GET("/letters", handlers.GetLettersHander)
	r.GET("/letters/trash", handlers.GetTrashLetterHandler)

	r.PUT("/letters/:id", handlers.UpdateLetterHandler)
	r.DELETE("/letters/:id", handlers.DeleteLetterHandler)
	r.GET("/letters/pdf-proxy", handlers.PdfProxyHandler)
	r.Run(":8082")
}
