package handlers

import (
	"church-platform/auth-service/internal/database"
	"church-platform/auth-service/internal/middleware"
	"church-platform/auth-service/internal/models"
	"church-platform/auth-service/internal/utils" // Adjust path to your auth db
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func AdminCreateUser(c *gin.Context) {
	userRole, exists := c.Get("user_role")
	if !exists || userRole != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admin can perform this action"})
		return
	}

	tenantID, _ := c.Get("tenant_id")
	if tenantID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid tenant session"})
		return
	}

	var newUser models.User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please check the fields provided"})
		return
	}

	hashedPassword, err := utils.HashPassword(newUser.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encrypt password"})
		return
	}

	newUser.ID = uuid.New()
	newUser.PasswordHash = hashedPassword
	newUser.TenantID = fmt.Sprintf("%v", tenantID)
	newUser.IsActive = true
	newUser.CreatedAt = time.Now()

	result := database.DB.Create(&newUser)
	if result.Error != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists or database error"})
		return
	}
	newUser.Password = ""
	adminEmail, _ := c.Get("user_email")
	RecordAudit(c, fmt.Sprintf("%v", adminEmail), fmt.Sprintf("Created new user: %s", newUser.Email))
	c.JSON(http.StatusCreated, newUser)
}
func Login(c *gin.Context) {

	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid login format"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(input.Email))
	log.Printf("Login attempt for email: '%s'", email)

	var user models.User
	result := database.DB.Where("LOWER(email) = ? AND is_active = ?", email, true).First(&user)

	if result.Error != nil {
		log.Printf("Login failed for '%s': %v", email, result.Error)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or account disabled"})
		return
	}

	if !utils.CheckPasswordHash(input.Password, user.PasswordHash) {
		middleware.AddStrike(c.ClientIP())
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
		return
	}
	middleware.ResetStrikes(c.ClientIP())

	// token, err := utils.GenerateToken(user.Email, user.Role, user.FullName, user.TenantID, user.Department)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
	// 	return
	// }

	// Set HttpOnly cookie for 10000% secure token storage
	// maxAge := 3600 * 24 // 24 hours in seconds

	// // Use http.SetCookie to support SameSite attribute
	// // http.SetCookie(c.Writer, &http.Cookie{
	// // 	Name:     "sst_auth_token",
	// // 	Value:    token,
	// // 	MaxAge:   maxAge,
	// // 	Path:     "/",
	// // 	Domain:   "",
	// // 	Secure:   true, // Set to true for HTTPS
	// // 	HttpOnly: true,
	// // 	SameSite: http.SameSiteLaxMode,
	// // })

	accessToken, _ := utils.GenerateToken(user.Email, user.Role, user.FullName, user.TenantID, user.Department)
	b := make([]byte, 32)
	rand.Read(b)
	refreshTokenValue := base64.StdEncoding.EncodeToString(b)
	refreshTokenRecord := models.RefreshToken{
		ID:        uuid.New(),
		UserID:    user.ID,
		Token:     refreshTokenValue,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}
	database.DB.Create(&refreshTokenRecord)

	RecordAudit(c, user.Email, "User logged in")

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "sst_access_token",
		Value:    accessToken,
		MaxAge:   900, // which is 15 min
		Path:     "/",
		Secure:   false, // Set to false for local HTTP development
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "sst_refresh_token",
		Value:    refreshTokenValue,
		MaxAge:   604800, // which is 7 day,
		Path:     "/auth/refresh",
		Secure:   false, // Set to false for local HTTP development
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	c.JSON(http.StatusOK, gin.H{
		"message": "Login Successful",
		"user": gin.H{
			"email":      user.Email,
			"name":       user.FullName,
			"role":       user.Role,
			"tenant_id":  user.TenantID,
			"department": user.Department,
		},
		"auth_details": gin.H{
			"role":       user.Role,
			"department": user.Department,
			"tenant_id":  user.TenantID,
		},
	})
}

func Logout(c *gin.Context) {
	// Clear the HttpOnly cookies
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "sst_access_token",
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "sst_refresh_token",
		Value:    "",
		MaxAge:   -1,
		Path:     "/auth/refresh",
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func GetMe(c *gin.Context) {
	email, exists := c.Get("user_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	var user models.User
	result := database.DB.Where("email = ? AND is_active = ?", email, true).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found or disabled"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"name":       user.FullName,
			"role":       user.Role,
			"tenant_id":  user.TenantID,
			"department": user.Department,
		},
	})
}

func SearchUsers(c *gin.Context) {
	email := c.Query("email")
	tenantID, exists := c.Get("tenant_id")

	if !exists || tenantID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Tenant information missing"})
		return
	}

	var users []models.User
	query := database.DB.Where("tenant_id = ?", tenantID)

	if email != "" {
		query = query.Where("email ILIKE ?", "%"+email+"%")
	}

	result := query.Find(&users)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
		return
	}

	// Remove passwords before returning
	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, users)
}

func UpdateUser(c *gin.Context) {
	var input struct {
		ID         string `json:"id"`
		Role       string `json:"role"`
		Department string `json:"department"`
		IsActive   *bool  `json:"is_active"` // Use pointer to distinguish between false and missing
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", input.ID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if input.Role != "" {
		user.Role = input.Role
	}
	if input.Department != "" {
		user.Department = input.Department
	}
	if input.IsActive != nil {
		user.IsActive = *input.IsActive
	}

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user permissions"})
		return
	}
	adminEmail, _ := c.Get("user_email")
	audit := models.AuditLog{
		Action:    fmt.Sprintf("Changed Permissions for : %v", adminEmail),
		Timestamp: time.Now(),
		IPAddress: c.ClientIP(),
	}
	database.DB.Create(&audit)

	c.JSON(http.StatusOK, gin.H{"message": "User security settings updated successfully"})
}

func InternalRecordAudit(c *gin.Context) {
	var input struct {
		AdminEmail string `json:"admin_email"`
		Action     string `json:"action"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid audit data"})
		return
	}

	audit := models.AuditLog{
		ID:         uuid.New(),
		AdminEmail: input.AdminEmail,
		Action:     input.Action,
		Timestamp:  time.Now(),
		IPAddress:  c.ClientIP(),
	}
	database.DB.Create(&audit)
	c.JSON(http.StatusOK, gin.H{"status": "Audit recorded"})
}

func GetAuditLogs(c *gin.Context) {
	userRole, _ := c.Get("user_role")
	if userRole != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only administrators can view audit logs"})
		return
	}

	var logs []models.AuditLog
	if err := database.DB.Order("timestamp desc").Limit(100).Find(&logs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audit logs"})
		return
	}

	c.JSON(http.StatusOK, logs)
}

func RecordAudit(c *gin.Context, adminEmail string, action string) {
	audit := models.AuditLog{
		ID:         uuid.New(),
		AdminEmail: adminEmail,
		Action:     action,
		Timestamp:  time.Now(),
		IPAddress:  c.ClientIP(),
	}
	database.DB.Create(&audit)
}

func Refresh(c *gin.Context) {
	cookie, err := c.Cookie("sst_refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No recovery Key found. login again"})
		return
	}
	var storedToken models.RefreshToken
	result := database.DB.Where("token = ? AND expires_at > ?", cookie, time.Now()).First(&storedToken)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Session expired"})
		return
	}
	var user models.User

	if err := database.DB.Where("id = ? ", storedToken.UserID).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User no longer exists"})
		return
	}
	newAccessToken, _ := utils.GenerateToken(user.Email, user.Role, user.FullName, user.TenantID, user.Department)
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "sst_access_token",
		Value:    newAccessToken,
		MaxAge:   900, // for 15 min,
		Path:     "/",
		Secure:   false, // Set to false for local dev
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	c.JSON(http.StatusOK, gin.H{"message": "Session renewed"})
}
