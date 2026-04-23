package main

import (
	"church-platform/auth-service/internal/database"
	handlers "church-platform/auth-service/internal/handler"
	"church-platform/auth-service/internal/middleware"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found.")
	}
}

func main() {
	database.InitDB()
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "Auth Service is up",
			"database": "PostgreSQL Connected"})
	})

	admin := r.Group("/admin")
	admin.Use(middleware.AuthGuard())
	{
		admin.POST("/create-user", handlers.AdminCreateUser)
		admin.GET("/users", handlers.SearchUsers)
		admin.PATCH("/update-user", handlers.UpdateUser)
		admin.GET("/audit-logs", handlers.GetAuditLogs)
	}

	r.POST("/login", middleware.LoginLimiter(), handlers.Login)
	r.POST("/logout", handlers.Logout)
	r.GET("/me", middleware.AuthGuard(), handlers.GetMe)
	r.POST("/refresh", handlers.Refresh)
	r.POST("/internal/audit", handlers.InternalRecordAudit)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
