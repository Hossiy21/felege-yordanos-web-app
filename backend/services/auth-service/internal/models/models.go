package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	FullName     string    `json:"full_name"`
	Email        string    `json:"email" gorm:"unique;not null"`
	Password     string    `json:"password,omitempty" gorm:"-"`   // Only for receiving data
	PasswordHash string    `json:"-" gorm:"column:password_hash"` // Only for DB
	DepartmentID int       `json:"department_id"`
	Role         string    `json:"role"` // "admin" or "staff"
	IsActive     bool      `json:"is_active" gorm:"column:is_active"`
	CreatedAt    time.Time `json:"created_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}
