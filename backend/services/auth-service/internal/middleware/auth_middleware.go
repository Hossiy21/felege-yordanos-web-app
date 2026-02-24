package middleware

import (
	"church-platform/auth-service/internal/auth"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthGuard() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenString string

		// First, try to get token from HttpOnly cookie
		cookie, err := c.Cookie("sst_auth_token")
		if err == nil {
			tokenString = cookie
		} else {
			// Fallback to Authorization header
			authHeader := c.GetHeader("Authorization")
			if authHeader != "" {
				tokenString = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization is required"})
			c.Abort()
			return
		}

		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}
		c.Set("user_email", claims["email"])
		c.Set("user_role", claims["role"])
		c.Next()
	}
}
