package middleware

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Println("CRITICAL ERROR: JWT_SECRET not found in environment variables!")
	}
		if secret == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Config error"})
			c.Abort()
			return
		}

		var tokenString string
		// Try to get token from HttpOnly cookie first
		if cookie, err := c.Cookie("sst_access_token"); err == nil {
			tokenString = cookie
		} else {
			// Fallback to Authorization header
			authHeader := c.GetHeader("Authorization")
			if authHeader != "" {
				tokenString = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		if tokenString == "" {
			log.Println("Gateway: No token provided in request")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected Signing methods : %v", t.Header["alg"])
			}
			return []byte(secret), nil
		})
		if err != nil || !token.Valid {
			tokenSnippet := ""
			if len(tokenString) > 10 {
				tokenSnippet = tokenString[:10] + "..."
			} else {
				tokenSnippet = tokenString
			}
			log.Printf("Gateway: Invalid or expired token (snippet: %s): %v", tokenSnippet, err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			role := fmt.Sprintf("%v", claims["role"])
			department := fmt.Sprintf("%v", claims["department"])
			tenantID := fmt.Sprintf("%v", claims["tenant_id"])
			email := fmt.Sprintf("%v", claims["email"])

			log.Printf("Gateway: Authenticated user %s (role: %s, dept: %s)", email, role, department)

			// Set headers for sub-services
			c.Request.Header.Set("X-User-Email", email)
			c.Request.Header.Set("X-User-Name", fmt.Sprintf("%v", claims["name"]))
			c.Request.Header.Set("X-User-Role", role)
			c.Request.Header.Set("X-User-Department", department)
			c.Request.Header.Set("X-Tenant-ID", tenantID)

			// RBAC & Department Check
			if role == "admin" {
				c.Next()
				return
			}

			// Check if the request path matches the department
			path := c.Request.URL.Path
			
			// SPECIAL CASE: Allow anyone with a valid token to access documents for now
			// or we can add "documents" to the allowed services for all departments.
			if strings.HasPrefix(path, "/documents") || strings.HasPrefix(path, "/api/documents") {
				c.Next()
				return
			}

			// Handle both /service and /api/service formats
			servicePathPrefix := "/" + department
			apiServicePathPrefix := "/api/" + department

			if strings.HasPrefix(path, servicePathPrefix) || strings.HasPrefix(path, apiServicePathPrefix) {
				c.Next()
				return
			}

			log.Printf("Gateway: Access denied for path %s (dept: %s)", path, department)
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied for your department"})
			c.Abort()
		}

	}
}
