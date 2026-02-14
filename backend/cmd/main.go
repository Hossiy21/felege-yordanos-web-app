package main

import (
	"church-system/internal/database"
	"church-system/internal/handlers"
	"church-system/internal/middleware"
	"fmt"
	"os"
	"os/signal"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	database.Connect()
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// this are my public routes but with ratelimiter(to avoid many sign attempts at once)
	r.POST("/register", middleware.RateLimiter(), handlers.RegisterUser)
	// r.POST("/login", middleware.RateLimiter(), handlers.LoginUser)
	r.POST("/login", handlers.LoginUser)
	r.GET("/roles", handlers.GetRolesHandler)

	//this are my protected route (secure)

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		admin := api.Group("/admin")
		admin.GET("/me", handlers.GetMeHandler)
		admin.Use(middleware.AdminOnly())
		{
			admin.GET("/stats", handlers.GetSystemStatsHandler)

			admin.GET("/users", handlers.GetAllUserHandler)
			admin.PATCH("/users/:id/role", handlers.UpdateUserRoleHandler)
		}
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

		//get from the trash
		api.GET("/letters/trash", handlers.GetDeletedLettersHandler)
		api.PATCH("/letters/:id/restore", handlers.RestoreLetterHandler)
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Server running on http://localhost:%s\n", port)

	go func() {
		if err := r.Run(":" + port); err != nil {
			fmt.Printf("Listen Eror: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	fmt.Println("Shutdown Server ....")
	database.Conn.Close()
	fmt.Println("Server exiting.")

}
