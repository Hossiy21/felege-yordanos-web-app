package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type News struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Content     string             `json:"content" bson:"content"`
	AuthorEmail string             `json:"author_email" bson:"author_email"`
	AuthorName  string             `json:"author_name" bson:"author_name"`
	DeletedAt   *time.Time         `json:"deleted_at" bson:"deleted_at"`
}
