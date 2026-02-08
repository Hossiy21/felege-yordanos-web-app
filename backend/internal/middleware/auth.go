package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"church-system/internal/auth"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Secret access only.Please log in."})
			c.Abort()
			return

		}
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format. Use 'Bearer <token>'"})
			c.Abort()
			return
		}
		tokenString := parts[1]
		claims, err := auth.ValidateToken(tokenString)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Session expired or invalid token"})
			c.Abort()
			return
		}
		c.Set("user_email", claims["email"])
		c.Set("user_role", claims["role"])

		c.Next()
	}
}
