package main

import (
	"church-platform/gateway-service/middleware"
	"church-platform/gateway-service/proxy"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Any("/auth/*proxyPath", proxy.NewProxy("http://auth-service:8080"))
	protected := r.Group("/")
	protected.Use(middleware.AuthRequired())
	{
		protected.Any("/news/*proxyPath", proxy.NewProxy("http://news-service:8081"))

	}
	r.Run(":8000")
}
