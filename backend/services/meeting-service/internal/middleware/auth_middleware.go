package middleware

import (
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.GetHeader("X-User-Email")
		role := c.GetHeader("X-User-Role")
		tenantID := c.GetHeader("X-Tenant-ID")

		if email == "" {
			c.JSON(401, gin.H{"error": "Unauthorized: Missing identity headers"})
			c.Abort()
			return
		}

		c.Set("user_email", email)
		c.Set("user_role", role)
		c.Set("tenant_id", tenantID)

		c.Next()
	}
}
