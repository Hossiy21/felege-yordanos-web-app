package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type News struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Summary     string             `json:"summary" bson:"summary"`
	Content     string             `json:"content" bson:"content"`
	Slug        string             `json:"slug" bson:"slug"`
	Category    string             `json:"category" bson:"category"`
	ImageURL    string             `json:"image_url" bson:"image_url"`
	AuthorEmail string             `json:"author_email" bson:"author_email"`
	AuthorName  string             `json:"author_name" bson:"author_name"`
	TenantID    string             `json:"tenant_id" bson:"tenant_id"`
	CreatedAt   time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at" bson:"updated_at"`
	DeletedAt   *time.Time         `json:"deleted_at" bson:"deleted_at"`
}
