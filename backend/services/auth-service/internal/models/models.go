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
	TenantID     string    `json:"tenant_id"`
	Role         string    `json:"role"`       // "admin" or "user"
	Department   string    `json:"department"` // "news", "graphics", "letters"
	IsActive     bool      `json:"is_active" gorm:"column:is_active"`
	CreatedAt    time.Time `json:"created_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}

type AuditLog struct {
	ID         uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	AdminEmail string    `json:"admin_email"`
	Action     string    `json:"action"`
	Timestamp  time.Time `json:"timestamp"`
	IPAddress  string    `json:"ip_address"`
}
type RefreshToken struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
}
