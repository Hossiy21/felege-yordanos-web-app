package middleware

import (
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.GetHeader("X-User-Email")
		name := c.GetHeader("X-User-Name")
		role := c.GetHeader("X-User-Role")
		tenantID := c.GetHeader("X-Tenant-ID")
		dept := c.GetHeader("X-User-Department")

		if email == "" {
			c.JSON(401, gin.H{"error": "Unauthorized: Missing user information"})
			c.Abort()
			return
		}

		// Set context values for handlers
		c.Set("user_email", email)
		c.Set("user_name", name)
		c.Set("user_role", role)
		c.Set("tenant_id", tenantID)
		c.Set("user_department", dept)

		c.Next()
	}
}
