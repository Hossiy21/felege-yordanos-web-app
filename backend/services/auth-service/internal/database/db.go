package database

import (
	"church-platform/auth-service/internal/models"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, dbname, port)

	var err error

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to Postgres for user=%s db=%s: %v", user, dbname, err)
	}

	fmt.Println("Running Database Migrations ...")
	err = DB.AutoMigrate(&models.User{}, &models.AuditLog{}, &models.RefreshToken{})
	if err != nil {
		log.Fatal("Migration Failed:", err)
	}

	var count int64
	DB.Model(&models.User{}).Count(&count)
	fmt.Printf("Auth Service connected! Total users in DB: %d\n", count)
}
