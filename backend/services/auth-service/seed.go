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

	fmt.Println("Migrating database...")
	db.AutoMigrate(&models.User{})

	// Helper to create user
	createUser := func(fullName, email, password, role, dept string) {
		hashed, _ := utils.HashPassword(password)
		u := models.User{
			ID:           uuid.New(),
			FullName:     fullName,
			Email:        email,
			PasswordHash: hashed,
			Role:         role,
			Department:   dept,
			TenantID:     "church_01",
			IsActive:     true,
		}

		// UPSERT: Create if not exists, or update if email exists
		result := db.Where("email = ?", email).FirstOrCreate(&u)
		if result.Error != nil {
			fmt.Printf("Error seeding %s: %v\n", email, result.Error)
		} else {
			fmt.Printf("Seeded: %s (%s / %s)\n", fullName, email, password)
		}
	}

	createUser("System Admin", "admin@church.com", "admin123", "admin", "none")
	createUser("News Editor", "news@church.com", "news123", "user", "news")
	createUser("Letter Staff", "letters@church.com", "letters123", "user", "letters")

	fmt.Println("Seeding complete!")
}
