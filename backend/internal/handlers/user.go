package handlers

import (
	"church-system/internal/auth"
	"church-system/internal/database"
	"church-system/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterUser(c *gin.Context) {
	var input struct {
		FullName        string `json:"full_name"`
		Email           string `json:"email"`
		Password        string `json:"password"`
		ConfirmPassword string `json:"confirm_password"`
		Role            string `json:"role"`
	}
	if err := c.ShouldBindJSON(&input); err != err {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invlid Input"})
		return
	}
	if input.Password != input.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password do not match"})
		return
	}

	ctx := c.Request.Context()
	validRoles, err := database.GetRoles(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error checking roles"})
		return
	}
	roleExists := false
	for _, r := range validRoles {
		if r == input.Role {
			roleExists = true
			break
		}
	}

	if !roleExists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":         "Selected role is not valid",
			"allowed_roles": validRoles,
		})
		return
	}

	hashedPassword, _ := auth.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to secure the password"})
		return
	}
	query := `INSERT into users (full_name,email,password_hash,role) values ($1,$2,$3,$4)`

	_, err = database.Conn.Exec(ctx, query, input.FullName, input.Email, hashedPassword, input.Role)

	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with email already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registration succesful!"})
}

func LoginUser(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid request"})
		return
	}

	var dbUser models.User
	query := `select id,email,password_hash,role from users where email = $1`
	err := database.Conn.QueryRow(c.Request.Context(), query, input.Email).Scan(&dbUser.ID, &dbUser.Email, &dbUser.PasswordHash, &dbUser.Role)
	if err != nil || !auth.CheckPasswordHash(input.Password, dbUser.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}
	token, err := auth.GenerateToken(dbUser.Email, dbUser.Role)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating session"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"Token": token})
}

func GetRolesHandler(c *gin.Context) {
	roles, err := database.GetRoles(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch roles"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"roles": roles})
}
