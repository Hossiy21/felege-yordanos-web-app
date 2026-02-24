package main

import (
	"church-platform/news-service/internal/database"
	handlers "church-platform/news-service/internal/handler"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	database.InitMongo()
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "News Service is Onlie!"})

	})
	r.GET("/news", handlers.GetNewsHandler)
	r.POST("/news", handlers.CreateNews)
	r.Run(":9001")
}
