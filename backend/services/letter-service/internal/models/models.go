package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

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
	// bson:"_id,omitempty" is the secret sauce for MongoDB
	ID              primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ReferenceNumber string             `json:"reference_number" bson:"reference_number"`
	LetterType      string             `json:"letter_type" bson:"letter_type"`
	Subject         string             `json:"subject" bson:"subject"`
	Status          string             `json:"status" bson:"status"`
	DepartmentID    int                `json:"department_id" bson:"department_id"`
	DepartmentName  string             `json:"department_name" bson:"department_name"`
	OwnerEmail      string             `json:"owner_email" bson:"owner_email"`
	CreatedAt       time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt       time.Time          `json:"updated_at" bson:"updated_at"`
	DeletedAt       *time.Time         `json:"deleted_at,omitempty" bson:"deleted_at,omitempty"`
}
