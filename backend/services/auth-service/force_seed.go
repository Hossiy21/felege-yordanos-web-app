package main

import (
	"church-platform/auth-service/internal/models"
	"church-platform/auth-service/internal/utils"
	"fmt"
	"log"
	"os"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, dbname, port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Force Seeding Database...")

	upsertUser := func(fullName, email, pass, role, dept string) {
		hashed, _ := utils.HashPassword(pass)
		var user models.User
		err := db.Where("email = ?", email).First(&user).Error

		if err != nil {
			// Create new
			user = models.User{
				ID:           uuid.New(),
				FullName:     fullName,
				Email:        email,
				PasswordHash: hashed,
				Role:         role,
				Department:   dept,
				TenantID:     "church_01",
				IsActive:     true,
			}
			db.Create(&user)
			fmt.Printf("CREATED: %s (%s / %s)\n", fullName, email, pass)
		} else {
			// Update existing
			user.FullName = fullName
			user.PasswordHash = hashed
			user.Role = role
			user.Department = dept
			user.TenantID = "church_01"
			user.IsActive = true
			db.Save(&user)
			fmt.Printf("UPDATED: %s (%s / %s)\n", fullName, email, pass)
		}
	}

	upsertUser("System Admin", "admin@church.com", "admin123", "admin", "none")
	upsertUser("News Editor", "news@church.com", "news123", "user", "news")
	upsertUser("Letter Staff", "letters@church.com", "letters123", "user", "letters")

	fmt.Println("Force Seeding complete!")
}
