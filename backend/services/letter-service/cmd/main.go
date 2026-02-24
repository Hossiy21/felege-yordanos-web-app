package main

import (
	"church-platform/letter-service/internal/database"
	"church-platform/letter-service/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	database.InitMongo()
	r := gin.Default()
	r.POST("/letters", handlers.CreateLetterHandler)
	r.GET("/letters", handlers.GetLettersHander)
	r.GET("/letters/trash", handlers.GetTrashLetterHandler)

	r.PUT("/letters/:id", handlers.UpdateLetterHandler)
	r.DELETE("/letters/:id", handlers.DeleteLetterHandler)
	r.Run(":8082")
}
