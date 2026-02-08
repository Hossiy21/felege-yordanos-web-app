package main

import (
	"church-system/internal/database"
	"church-system/internal/handlers"
	"church-system/internal/middleware"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()
	r := gin.Default()

	// this are my public routes but with ratelimiter(to avoid many sign attempts at once)
	r.POST("/register", middleware.RateLimiter(), handlers.RegisterUser)
	r.POST("/login", middleware.RateLimiter(), handlers.LoginUser)
	r.GET("/roles", handlers.GetRolesHandler)

	//this are my protected route (secure)

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		// department
		api.GET("/departments", handlers.GetDepartmentsHandler)
		api.POST("/departments", handlers.CreateDepartmentHandler)

		//my letter
		api.GET("/letters", handlers.GetLettersHandler)
		api.POST("/letters", handlers.CreateLetterHandler)
		api.PUT("/letters/:id", handlers.UpdateLetterHandler)
	}

	fmt.Println("Server Started on http://localhost:8000")
	r.Run(":8080")

}
