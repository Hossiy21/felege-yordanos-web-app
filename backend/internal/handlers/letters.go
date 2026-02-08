package handlers

import (
	"church-system/internal/database"
	"church-system/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func CreateLetterHandler(c *gin.Context) {
	var input struct {
		ReferenceNumber string `json:"reference_number"`
		LetterType      string `json:"letter_type"`
		Subject         string `json:"subject"`
		DepartmentId    int    `json:"department_id"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Check your JSON format"})
		return
	}
	query := `INSERT INTO letters (reference_number,letter_type,subject,status,department_id) values ($1,$2,$3,$4,$5)`

	_, err := database.Conn.Exec(c, query, input.ReferenceNumber, input.LetterType, input.Subject, "pending", input.DepartmentId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB Error: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "Letter saved!"})

}
func GetLettersHandler(c *gin.Context) {
	userEmail, _ := c.Get("user_email")
	userRole, _ := c.Get("user_role")

	var rows pgx.Rows
	var err error
	var args []interface{}
	baseQuery := `select let.id, let.reference_number,let.letter_type,let.subject,let.status,let.department_id,coalesce(dep.dep_name,'No Deps') as dep_name,let.owner_email,let.created_at,let.updated_at from letters let left join departments dep on let.department_id = dep.id`

	var finalQuery string
	if userRole == "admin" {
		finalQuery = baseQuery
		rows, err = database.Conn.Query(c.Request.Context(), finalQuery)
	} else {
		finalQuery = baseQuery + ` where let.owner_email = $1`
		args = append(args, userEmail)
		rows, err = database.Conn.Query(c.Request.Context(), finalQuery, args...)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed :" + err.Error()})
		return
	}
	defer rows.Close()

	letters := []models.Letter{}
	for rows.Next() {
		var l models.Letter
		err := rows.Scan(
			&l.ID, &l.ReferenceNumber, &l.LetterType, &l.Subject, &l.Status, &l.DepartmentID, &l.DepartmentName, &l.OwnerEmail, &l.CreatedAt, &l.UpdatedAt,
		)
		if err != nil {
			fmt.Printf("Scan error : %v \n", err)
			continue
		}
		letters = append(letters, l)

	}
	c.JSON(http.StatusOK, letters)

}

func UpdateLetterHandler(c *gin.Context) {
	letterId := c.Param("id")
	userEmail, _ := c.Get("user_email")
	userRole, _ := c.Get("user_role")

	var currentReferenceNumber, currentLetterType, currentSubject, currentOwnerEmail string
	var currentDept int

	fetchQuery := `select reference_number,letter_type,subject,department_id,owner_email from letters where id = $1`
	err := database.Conn.QueryRow(c.Request.Context(), fetchQuery, letterId).Scan(
		&currentReferenceNumber, &currentLetterType, &currentSubject, &currentDept, &currentOwnerEmail,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Letter Not Found"})
		return
	}

	if userRole != "admin" && currentOwnerEmail != userEmail.(string) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You dont have permission to edit this"})
		return
	}
	var input struct {
		ReferenceNumber string `json:"reference_number"`
		LetterType      string `json:"letter_type"`
		Subject         string `json:"subject"`
		DepartmentID    int    `json:"department_id"`
		OwnerEmail      string `json:"owner_email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Check your JSON format: " + err.Error()})
		return
	}
	if input.ReferenceNumber == "" {
		input.ReferenceNumber = currentReferenceNumber
	}
	if input.LetterType == "" {
		input.LetterType = currentLetterType
	}
	if input.Subject == "" {
		input.Subject = currentSubject
	}
	if input.DepartmentID == 0 {
		input.DepartmentID = currentDept
	}
	if input.OwnerEmail == "" {
		input.OwnerEmail = currentOwnerEmail
	}
	updateQuery := `update letters set reference_number=$1,letter_type=$2,subject=$3,department_id=$4,owner_email=$5 where id=$6`
	_, err = database.Conn.Exec(c.Request.Context(), updateQuery, input.ReferenceNumber, input.LetterType, input.Subject, input.DepartmentID, input.OwnerEmail, letterId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update letters"})
		return
	}
	// c.JSON(http.StatusOK, gin.H{"message": "Letter updated successfully"})
	c.JSON(http.StatusOK, gin.H{"message": "I AM THE NEW CODE 12345"})
}
