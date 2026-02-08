package handlers

import (
	"church-system/internal/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetDepartmentsHandler የሥራ ክፍሎችን በ JSON መልክ ለ Browser ይልካል
func GetDepartmentsHandler(c *gin.Context) {
	depts, err := database.GetAllDepartments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, depts)
}

func CreateDepartmentHandler(c *gin.Context) {
	var input struct {
		Name       string `json:"name"`
		Desciption string `json:"description"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data sent"})
		return
	}
	query := `INSERT INTO departments (name,description) values ($1, $2)`

	_, err := database.Conn.Exec(c, query, input.Name, input.Desciption)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failde to save to database"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Department Created Succesfuly"})
}
