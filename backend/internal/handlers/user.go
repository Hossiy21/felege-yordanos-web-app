package handlers

import (
	"church-system/internal/auth"
	"church-system/internal/database"
	"church-system/internal/middleware"
	"church-system/internal/models"
	"fmt"
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

func GetAllUserHandler(c *gin.Context) {
	query := `select id,email,role,created_at from users order by created_at desc`
	ctx := c.Request.Context()
	rows, err := database.Conn.Query(ctx, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users."})
		return
	}
	defer rows.Close()

	type UserInfo struct {
		ID        int    `json:"id"`
		Email     string `json:"email"`
		Role      string `json:"role"`
		CreatedAt string `json:"created_at"`
	}
	var users []UserInfo
	for rows.Next() {
		var u UserInfo
		var createdAt interface{}
		if err := rows.Scan(&u.ID, &u.Email, &u.Role, &u.CreatedAt); err != nil {
			continue
		}
		u.CreatedAt = fmt.Sprintf("%v", createdAt)
		users = append(users, u)
	}
	c.JSON(http.StatusOK, users)
}
func UpdateUserRoleHandler(c *gin.Context) {
	userID := c.Param("id") // want to get the id from the url
	var input struct {
		Role string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Role is needed"})
		return
	}
	roleChecker := input.Role

	if roleChecker != "admin" && roleChecker != "user" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only Admin or User to access this "})
		return
	}
	query := `update users set role = $1,updated_at = now() where id = $2`
	result, err := database.Conn.Exec(c.Request.Context(), query, input.Role, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update"})
		return
	}
	if result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Users not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User role updated"})
}
func GetMeHandler(c *gin.Context) {
	email, emailExists := c.Get(middleware.EmailKey)
	role, roleExists := c.Get(middleware.RoleKey)

	if !emailExists || !roleExists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"email":  email,
		"role":   role,
		"status": "authenticated",
	})
}
