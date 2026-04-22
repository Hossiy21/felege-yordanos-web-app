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
			// If no header, maybe it's direct access or dev mode
			// For now, let's be strict if we expect the gateway to handle it
			// but we can allow it for local testing if needed.
			// Actually, let's keep it consistent with letter-service.
			c.Set("user_email", "guest@church.com")
			c.Set("tenant_id", "default")
			c.Next()
			return
		}

		c.Set("user_email", email)
		c.Set("user_role", role)
		c.Set("tenant_id", tenantID)

		c.Next()
	}
}
