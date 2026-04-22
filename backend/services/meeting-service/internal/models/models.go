package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Meeting struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Date        string             `json:"date" bson:"date"`
	Time        string             `json:"time" bson:"time"`
	Location    string             `json:"location,omitempty" bson:"location,omitempty"`
	Attendees   int                `json:"attendees" bson:"attendees"`
	Decisions   int                `json:"decisions" bson:"decisions"`
	Status      string             `json:"status" bson:"status"` // Upcoming, Completed, Cancelled
	IsEmergency bool               `json:"is_emergency" bson:"is_emergency"`
	Type        string             `json:"type" bson:"type"` // regular, emergency, special
	Agenda      string             `json:"agenda,omitempty" bson:"agenda,omitempty"`
	TenantID    string             `json:"tenant_id" bson:"tenant_id"`
	CreatedAt   time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at" bson:"updated_at"`
	DeletedAt   *time.Time         `json:"deleted_at,omitempty" bson:"deleted_at,omitempty"`
}
