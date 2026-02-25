package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MeetingCollection *mongo.Collection

func InitMongo() {
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017"
	}
	clientOptions := options.Client().ApplyURI(uri)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Meeting Service Mongo Connect Error :", err)
	}
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Meeting Service Mongo Ping Error :", err)
	}
	log.Println("Meeting Service Connected to MongoDB")
	const (
		dbName         = "church_meetings_db"
		collectionName = "meetings"
	)
	MeetingCollection = client.Database(dbName).Collection(collectionName)
}
