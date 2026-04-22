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

	var users []models.User
	database.DB.Find(&users)

	fmt.Println("Users in database:")
	for _, u := range users {
		fmt.Printf("- Email: %s, FullName: %s, IsActive: %t, Department: %s, Role: %s\n", u.Email, u.FullName, u.IsActive, u.Department, u.Role)
	}
}
