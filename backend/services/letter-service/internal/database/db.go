package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var LetterCollection *mongo.Collection

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
		log.Fatal("Letter Service Mongo Connect Error :", err)
	}
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Letter Service Mongo Ping Error :", err)
	}
	log.Println("Letter Service Connected to MongoDB")
	const (
		dbName         = "church_letters_db"
		collectionName = "letters"
	)
	LetterCollection = client.Database(dbName).Collection(collectionName)

}
