package main

import (
	"church-platform/gateway-service/middleware"
	"church-platform/gateway-service/proxy"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Add CORS middleware
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(config))
	r.Any("/auth/*proxyPath", proxy.NewProxy("http://localhost:8080"))
	// Proxy for MinIO (Storage) - No auth required for public view
	r.Any("/storage/*proxyPath", proxy.NewProxy("http://127.0.0.1:9000"))

	protected := r.Group("/")
	protected.Use(middleware.AuthRequired())
	{
		protected.Any("/news/*proxyPath", proxy.NewProxy("http://127.0.0.1:8081"))
		protected.Any("/letters/*proxyPath", proxy.NewProxy("http://127.0.0.1:8082"))
		protected.Any("/documents/*proxyPath", proxy.NewProxy("http://127.0.0.1:8084"))
		protected.Any("/documents", proxy.NewProxy("http://127.0.0.1:8084"))
		protected.Any("/api/admin/*proxyPath", proxy.NewProxy("http://127.0.0.1:8080/admin"))
	}
	r.Run(":8000")
}
