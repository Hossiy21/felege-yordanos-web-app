package database

import (
	"church-system/internal/models" // ሞዴሉን እንጠራዋለን
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

var Conn *pgx.Conn

func Connect() {
	connString := "postgres://postgres@localhost:5432/church_management_db"
	var err error
	Conn, err = pgx.Connect(context.Background(), connString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("ዳታቤዙ በስኬት ተገናኝቷል!")
}

// GetAllDepartments ሁሉንም የሥራ ክፍሎች ያመጣል
func GetAllDepartments() ([]models.Department, error) {
	rows, err := Conn.Query(context.Background(), "SELECT id, name, description FROM departments")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var depts []models.Department
	for rows.Next() {
		var d models.Department
		err := rows.Scan(&d.ID, &d.Name, &d.Description)
		if err != nil {
			return nil, err
		}
		depts = append(depts, d)
	}
	return depts, nil
}
func GetAllLetters() ([]models.Letter, error) {
	// Column order: 0:id, 1:ref, 2:type, 3:subj, 4:status, 5:dep_id, 6:dep_name, 7:created, 8:updated
	query := `SELECT 
                let.id, 
                let.reference_number, 
                let.letter_type, 
                let.subject, 
                let.status, 
                let.department_id, 
                dep.dep_name, 
                let.created_at, 
                let.updated_at 
              FROM letters let 
              LEFT JOIN departments dep ON dep.id = let.department_id`

	rows, err := Conn.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	letters := []models.Letter{}
	for rows.Next() {
		var d models.Letter
		// WE MUST SCAN INTO 9 VARIABLES TO MATCH THE 9 COLUMNS ABOVE
		err := rows.Scan(
			&d.ID,
			&d.ReferenceNumber,
			&d.LetterType,
			&d.Subject,
			&d.Status,
			&d.DepartmentID,
			&d.DepartmentName,
			&d.CreatedAt,
			&d.UpdatedAt,
		)
		if err != nil {
			fmt.Println("Scan error details:", err) // This will show in your terminal
			return nil, err
		}
		letters = append(letters, d)
	}
	return letters, nil
}

func GetRoles(ctx context.Context) ([]string, error) {
	var roles []string

	query := `SELECT DISTINCT role from USERS where role is not null`

	rows, err := Conn.Query(ctx, query)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var role string
		if err := rows.Scan(&role); err == nil {
			roles = append(roles, role)
		}
	}

	if len(roles) == 0 {
		return []string{"admin", "staff", "editor"}, nil
	}
	return roles, nil

}
