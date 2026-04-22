package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Document struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title        string             `bson:"title" json:"title"`
	Name         string             `bson:"name" json:"name"`
	FileType     string             `bson:"file_type" json:"file_type"`
	FileSize     int64              `bson:"file_size" json:"file_size"`
	URL          string             `bson:"url" json:"url"`
	OwnerEmail   string             `bson:"owner_email" json:"owner_email"`
	TenantID     string             `bson:"tenant_id" json:"tenant_id"`
	Description  string             `bson:"description" json:"description"`
	DocumentDate time.Time          `bson:"document_date" json:"document_date"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
}
