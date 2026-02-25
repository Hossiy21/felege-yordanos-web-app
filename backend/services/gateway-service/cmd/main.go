package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	// "strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

}
func main() {
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()

	// Enable CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000"}, // Specify the exact frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// check the health
	r.GET("/gateway-health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "Gateway is runnig"})
	})
	api := r.Group("/api")
	{

		api.Any("/:service/*path", func(c *gin.Context) {

			service := c.Param("service")
			path := c.Param("path")
			var targetUrl string

			switch service {

			case "auth":
				targetUrl = os.Getenv("AUTH_SERVICE_URL")
			case "letter":
				targetUrl = os.Getenv("LETTER_SERVICE_URL")
			case "news":
				targetUrl = os.Getenv("NEWS_SERVICE_URL")
			case "meeting":
				targetUrl = os.Getenv("MEETING_SERVICE_URL")
			default:
				c.JSON(http.StatusNotFound, gin.H{"error": "Service route not defined"})
			}
			if targetUrl == "" {
				c.JSON(http.StatusBadGateway, gin.H{"error": "Target URL not configured"})
				return
			}
			remote, err := url.Parse(targetUrl)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid Target URL"})
				return
			}
			proxy := httputil.NewSingleHostReverseProxy(remote)
			c.Request.Host = remote.Host
			c.Request.URL.Host = remote.Host
			c.Request.URL.Scheme = remote.Scheme

			c.Request.URL.Path = path

			log.Printf("Proxying request : %s -> %s%s", path, targetUrl, path)
			proxy.ServeHTTP(c.Writer, c.Request)

		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Printf("Gateway Service started on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start Gateway: %v", err)
	}
}
