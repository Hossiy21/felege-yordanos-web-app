package main

import (
	"church-platform/auth-service/internal/database"
	"church-platform/auth-service/internal/models"
	"encoding/json"
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

	out, _ := json.MarshalIndent(users, "", "  ")
	fmt.Println(string(out))
}
