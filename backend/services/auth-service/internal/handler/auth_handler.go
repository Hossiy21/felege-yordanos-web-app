package handlers

import (
	"church-platform/auth-service/internal/database"
	"church-platform/auth-service/internal/models"
	"church-platform/auth-service/internal/utils" // Adjust path to your auth db
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func AdminCreateUser(c *gin.Context) {

	userRole, exists := c.Get("user_role")
	if !exists || userRole != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admin can perform this action"})
		return
	}
	var newUser models.User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please check the fields provided"})
		return
	}
	hashedPassword, err := utils.HashPassword(newUser.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Encrpt Password"})
		return
	}
	newUser.PasswordHash = hashedPassword
	newUser.IsActive = true
	newUser.CreatedAt = time.Now()

	result := database.DB.Create(&newUser)

	if result.Error != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}
	newUser.Password = ""
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

	var user models.User

	result := database.DB.Where("email = ? AND is_active = ?", input.Email, true).First(&user)

	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or account disabled"})
		return
	}

	if !utils.CheckPasswordHash(input.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
		return
	}

	token, err := utils.GenerateToken(user.Email, user.Role, user.FullName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	// Set HttpOnly cookie for 10000% secure token storage
	maxAge := 3600 * 24 // 24 hours in seconds
	c.SetCookie("sst_auth_token", token, maxAge, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login Successful",
		"user": gin.H{
			"email": user.Email,
			"name":  user.FullName,
			"role":  user.Role,
		},
	})
}

func Logout(c *gin.Context) {
	// Clear the HttpOnly cookie by setting an expired MaxAge
	c.SetCookie("sst_auth_token", "", -1, "/", "", false, true)
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
			"id":    user.ID,
			"email": user.Email,
			"name":  user.FullName,
			"role":  user.Role,
		},
	})
}
