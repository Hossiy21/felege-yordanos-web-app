package main

import (
	"church-platform/auth-service/internal/database"
	"church-platform/auth-service/internal/models"
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	database.InitDB()

	email := "news@church.com"
	var user models.User
	err := database.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		fmt.Printf("User %s NOT FOUND: %v\n", email, err)
		return
	}

	fmt.Printf("User found: Email=%s, IsActive=%t, Role=%s\n", user.Email, user.IsActive, user.Role)
}
