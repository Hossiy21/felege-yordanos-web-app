package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(email string, role string, name string, tenantID string, department string) (string, error) {
	var secretKey = []byte(os.Getenv("JWT_SECRET"))
	claims := jwt.MapClaims{
		"email":      email,
		"role":       role,
		"name":       name,
		"tenant_id":  tenantID,
		"department": department,
		"exp":        time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}
