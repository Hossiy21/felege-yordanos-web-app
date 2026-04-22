package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	// "strings"

	"church-platform/gateway-service/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		// Try parent directory
		if err := godotenv.Load("../.env"); err != nil {
			log.Println("No .env file found")
		}
	}
}
func main() {
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-User-Email", "X-User-Name", "X-User-Role", "X-User-Department", "X-Tenant-ID"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type", "Content-Disposition", "Cache-Control"},
		AllowCredentials: true,
	}))

	// check the health
	r.GET("/gateway-health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "Gateway is runnig"})
	})
	api := r.Group("/api")
	{
		// NO AUTH for Auth service (Login/Register)
		api.Any("/auth/*path", func(c *gin.Context) {
			proxyReq(c, os.Getenv("AUTH_SERVICE_URL"))
		})

		// Allow public GET for news
		api.GET("/news/*path", func(c *gin.Context) {
			proxyReq(c, os.Getenv("NEWS_SERVICE_URL"))
		})

		// Allow public GET for gallery
		api.GET("/gallery/*path", func(c *gin.Context) {
			proxyReq(c, os.Getenv("NEWS_SERVICE_URL"))
		})

		// Allow public GET for storage (MinIO)
		api.GET("/storage/*path", func(c *gin.Context) {
			proxyReq(c, "http://localhost:9000")
		})

		// AUTH REQUIRED for everything else
		protected := api.Group("/")
		protected.Use(middleware.AuthRequired())
		{
			protected.Any("/:service/*path", func(c *gin.Context) {
				service := c.Param("service")
				var targetUrl string
				switch service {
				case "letter":
					targetUrl = os.Getenv("LETTER_SERVICE_URL")
				case "news":
					targetUrl = os.Getenv("NEWS_SERVICE_URL")
				case "documents":
					targetUrl = os.Getenv("DOCUMENT_SERVICE_URL")
				case "gallery":
					targetUrl = os.Getenv("GALLERY_SERVICE_URL")
				case "meeting":
					targetUrl = os.Getenv("MEETING_SERVICE_URL")
				default:
					c.JSON(http.StatusNotFound, gin.H{"error": "Service route not defined"})
					return
				}
				proxyReq(c, targetUrl)
			})
		}
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

func proxyReq(c *gin.Context, target string) {
	if target == "" {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Target URL not configured"})
		return
	}
	remote, err := url.Parse(target)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid Target URL"})
		return
	}

	path := c.Param("path")
	proxy := httputil.NewSingleHostReverseProxy(remote)

	// Add this: Remove CORS headers from sub-service to prevent duplication
	proxy.ModifyResponse = func(resp *http.Response) error {
		resp.Header.Del("Access-Control-Allow-Origin")
		resp.Header.Del("Access-Control-Allow-Credentials")
		resp.Header.Del("Access-Control-Allow-Methods")
		resp.Header.Del("Access-Control-Allow-Headers")
		return nil
	}

	c.Request.Host = remote.Host
	c.Request.URL.Host = remote.Host
	c.Request.URL.Scheme = remote.Scheme
	c.Request.URL.Path = path

	log.Printf("Proxying request : %s -> %s%s", path, target, path)
	proxy.ServeHTTP(c.Writer, c.Request)
}
