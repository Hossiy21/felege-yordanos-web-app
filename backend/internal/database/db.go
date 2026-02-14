package database

import (
	"church-system/internal/models" // ሞዴሉን እንጠራዋለን
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var Conn *pgxpool.Pool

func Connect() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Note : No .env filed found")
	}
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", user, pass, host, port, name)

	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Fatalf("Unable to parse connection string : %v \n", err)
	}
	var errConect error

	Conn, errConect = pgxpool.NewWithConfig(context.Background(), config)
	if errConect != nil {
		log.Fatalf("Unable to connect to db: %v\n", err)
	}
	if err := Conn.Ping(context.Background()); err != nil {
		log.Fatalf("DB unreacheable : %v\n", err)
	}
	fmt.Println("DB Connected")

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
	// Exactly 9 columns selected
	query := `SELECT 
                let.id, 
                let.reference_number, 
                let.letter_type, 
                let.subject, 
                let.status, 
                let.department_id, 
                COALESCE(dep.dep_name, 'No Dept'), 
                let.created_at, 
                let.updated_at 
              FROM letters let 
              LEFT JOIN departments dep ON dep.id = let.department_id 
              WHERE let.deleted_at IS NULL`

	rows, err := Conn.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var letters []models.Letter
	for rows.Next() {
		var d models.Letter
		// Scan exactly 9 fields in the correct order
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
			fmt.Println("Admin Scan Error:", err)
			continue
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
