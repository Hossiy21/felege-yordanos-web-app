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

	email := "letters@church.com"
	var users []models.User
	result := database.DB.Where("email ILIKE ?", "%"+email+"%").Find(&users)
	if result.Error != nil {
		log.Fatal(result.Error)
	}

	fmt.Printf("Search for '%s' returned %d results\n", email, len(users))
	for _, u := range users {
		fmt.Printf("- %s (%s)\n", u.FullName, u.Email)
	}
}
