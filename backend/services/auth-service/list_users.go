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

	fmt.Println("Users in DB:")
	for _, u := range users {
		fmt.Printf("ID: %s, Email: %s, FullName: %s, TenantID: %s, IsActive: %t\n", u.ID, u.Email, u.FullName, u.TenantID, u.IsActive)
	}
}
