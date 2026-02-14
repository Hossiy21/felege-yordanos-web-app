package handlers

import (
	"church-system/internal/database"
	"church-system/internal/middleware"
	"church-system/internal/models"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	// "github.com/tdewolff/parse/v2/strconv"
)

func CreateLetterHandler(c *gin.Context) {

	userEmail, _ := c.Get("user_email")
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
	query := `INSERT INTO letters (reference_number,letter_type,subject,status,department_id,owner_email) values ($1,$2,$3,$4,$5,$6)`

	_, err := database.Conn.Exec(c, query, input.ReferenceNumber, input.LetterType, input.Subject, "pending", input.DepartmentId, userEmail)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB Error: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "Letter saved!"})

}
func GetLettersHandler(c *gin.Context) {
	userEmail, _ := c.Get(middleware.EmailKey)
	userRole, _ := c.Get(middleware.RoleKey)
	roleStr, _ := userRole.(string)

	var query string
	var args []interface{}

	baseQuery := `select let.id , let.reference_number,let.letter_type,let.subject,let.status,let.department_id,coalesce(dep.dep_name,'No Dept'),let.owner_email,let.created_at,let.updated_at from letters let left join departments dep on dep.id = let.department_id where let.deleted_at is null`

	if roleStr == "admin" {
		// admin will get every thing
		query = baseQuery
	} else {
		//the rest user see their data only
		query = baseQuery + " and let.owner_email = $1"
		args = append(args, userEmail)
	}
	rows, err := database.Conn.Query(c.Request.Context(), query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	defer rows.Close()

	var letters []models.Letter
	for rows.Next() {
		var l models.Letter
		err := rows.Scan(
			&l.ID, &l.ReferenceNumber, &l.LetterType, &l.Subject,
			&l.Status, &l.DepartmentID, &l.DepartmentName,
			&l.OwnerEmail, &l.CreatedAt, &l.UpdatedAt,
		)
		if err != nil {
			fmt.Println("User Scan Error:", err)
			continue
		}
		letters = append(letters, l)
	}
	c.JSON(http.StatusOK, letters)
}

func GetLetterHandlerById(c *gin.Context) {
	// letterId := c.Param("id")
	userEmail, _ := c.Get("user_email")
	userRole, _ := c.Get("user_role")

	var rows pgx.Rows
	var err error
	var args []interface{}

	baseQuery := `select let.id,let.reference_number,let.letter_type,let.subject,let.status,let.department_id,coalesce(dep.dep_name,'No Deps'),let.owner_email,let.created_at,let.updated_at from letters let left join departments dep on dep.id = let.department_id where let.id= $1`

	var finalQuery string
	if userRole == "admin" {
		finalQuery = baseQuery
		rows, err = database.Conn.Query(c.Request.Context(), finalQuery)

	} else {
		finalQuery = baseQuery + ` and owner_email=$2`
		args = append(args, userEmail)
		rows, err = database.Conn.Query(c.Request.Context(), finalQuery, args...)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error :" + err.Error()})
		return
	}
	defer rows.Close()

	letters := []models.Letter{}
	for rows.Next() {
		var l models.Letter
		err := rows.Scan(
			&l.ID, &l.ReferenceNumber, &l.LetterType, &l.Subject, &l.DepartmentID, &l.DepartmentName, &l.OwnerEmail, &l.CreatedAt, &l.UpdatedAt)

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

	var currentOwner, currentStatus string
	query := `select owner_email , status from letters where id = $1`
	err := database.Conn.QueryRow(c.Request.Context(), query, letterId).Scan(&currentOwner, &currentStatus)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Letter not found"})
		return
	}
	if userRole != "admin" && currentOwner != userEmail.(string) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized access!"})
		return
	}
	if currentStatus == "APPROVED" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Approved letters are located for security"})
		return
	}
	var input struct {
		Subject      string `json:"subject"`
		LetterType   string `json:"letter_type"`
		DepartmentID int    `json:"department_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invalid Input"})
		return
	}

	// i have to start the trasaction her

	tx, err := database.Conn.Begin(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start transaction"})
		return
	}
	defer tx.Rollback(c.Request.Context())

	// let me start the update process here

	updateQuery := `update letters set subject=$1 , letter_type=$2 , department_id = $3 , updated_at = now() where id = $4`

	_, err = tx.Exec(c.Request.Context(), updateQuery, input.Subject, input.LetterType, input.DepartmentID, letterId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}
	// let me add to letter audit history

	auditQuery := `Insert into letters_audit (letter_id,action,performed_by) values ($1, $2,$3)`
	_, err = tx.Exec(c.Request.Context(), auditQuery, letterId, "UPDATE", userEmail)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Audit logging failed "})
		return
	}

	if err := tx.Commit(c.Request.Context()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to finalize changes"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Letter Update"})
}

func DeleteLetterHandler(c *gin.Context) {
	letterIdStr := c.Param("id")
	userEmail, _ := c.Get("user_email")

	letterId, err := strconv.Atoi(letterIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	tx, err := database.Conn.Begin(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start transaction"})
		return
	}
	defer tx.Rollback(c.Request.Context())

	softDeleteQuery := `update letters set deleted_at = now() where id = $1 and deleted_at is NULL`
	result, err := tx.Exec(c.Request.Context(), softDeleteQuery, letterId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete operation failed"})
		return
	}

	rows := result.RowsAffected()

	if rows == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Letters not found or already deleted"})
		return
	}
	auditQuery := `insert into letters_audit (letter_id,action,performed_by) values ($1,$2,$3)`

	_, err = tx.Exec(c.Request.Context(), auditQuery, letterId, "SOFT_DELETE", userEmail)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Audit logging failed:" + err.Error()})
		return
	}
	if err := tx.Commit(c.Request.Context()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save deletion"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Letter Successfully Moved to trash"})

}
func GetDeletedLettersHandler(c *gin.Context) {
	query := `select id , subject , letter_type,status,deleted_at from letters where deleted_at is not null`
	rows, err := database.Conn.Query(c.Request.Context(), query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch trash"})
		return
	}

	defer rows.Close()
	var letters []map[string]interface{}
	for rows.Next() {
		var id int
		var subject, letterType, status string
		var deletedAt interface{}
		rows.Scan(&id, &subject, &letterType, &status, &deletedAt)

		letters = append(letters, map[string]interface{}{
			"id":         id,
			"subject":    subject,
			"type":       letterType,
			"status":     status,
			"deleted_at": deletedAt,
		})
	}
	c.JSON(http.StatusOK, letters)
}
func RestoreLetterHandler(c *gin.Context) {
	letterIdStr := c.Param("id")
	userEmail, _ := c.Get("user_email")
	letterId, _ := strconv.Atoi(letterIdStr)

	tx, err := database.Conn.Begin(c.Request.Context())
	if err != nil {
		c.JSON(500, gin.H{"error": "Transaction failed"})
		return
	}
	defer tx.Rollback(c.Request.Context())
	query := `update letters set deleted_at = null where id = $1`
	result, err := tx.Exec(c.Request.Context(), query, letterId)

	if err != nil || result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Letter not found in trash."})
		return
	}
	auditQuery := `insert into letters_Audit (letter_id,action,performed_by) values ($1,$2,$3)`
	_, err = tx.Exec(c.Request.Context(), auditQuery, letterId, "RESTORE", userEmail)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Failed to log audit"})
		return
	}
	tx.Commit(c.Request.Context())
	c.JSON(http.StatusOK, gin.H{"message": "Letter restored."})
}
