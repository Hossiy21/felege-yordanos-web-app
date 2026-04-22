package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DocumentCollection *mongo.Collection

func InitDB() {
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	dbName := os.Getenv("MONGO_DB_NAME")
	if dbName == "" {
		dbName = "church_content"
	}

	DocumentCollection = client.Database(dbName).Collection("documents")
	log.Println("Successfully connected to Documents collection")
}
