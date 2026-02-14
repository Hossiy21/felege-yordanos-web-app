package models

import "time"

// Department የሥራ ክፍሎችን ይወክላል
type Department struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// User ተጠቃሚዎችን ይወክላል
type User struct {
	ID           int       `json:"id"`
	FullName     string    `json:"full_name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // ለደህንነት ሲባል JSON ላይ አይታይም
	DepartmentID int       `json:"department_id"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}

// Letter ደብዳቤዎችን ይወክላል
type Letter struct {
	ID              int        `json:"id"`
	ReferenceNumber string     `json:"reference_number"`
	LetterType      string     `json:"letter_type"`
	Subject         string     `json:"subject"`
	Status          string     `json:"status"`
	DepartmentID    int        `json:"department_id"`
	DepartmentName  string     `json:"department_name"`
	OwnerEmail      string     `json:"owner_email"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	DeletedAt       *time.Time `json:"deleted_at,omitempty"`
}
