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

		//get list of all letters
		api.GET("/letters", handlers.GetLettersHandler)

		//get list of letters by id
		api.GET("/letters/:id", handlers.GetLetterHandlerById)

		//to create new letter
		api.POST("/letters", handlers.CreateLetterHandler)

		//to update existing letter if approved
		api.PUT("/letters/:id", handlers.UpdateLetterHandler)
		api.DELETE("/letters/:id", handlers.DeleteLetterHandler)
	}

	fmt.Println("Server Started on http://localhost:8000")
	r.Run(":8080")

}
