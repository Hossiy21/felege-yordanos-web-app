package database

import (
	"context"
	"log"
	"time"

	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Env struct {
	NewsCol *mongo.Collection
}

var NewsCollection *mongo.Collection
var GalleryCollection *mongo.Collection

func InitMongo() {
	dbLink := os.Getenv("MONGO_URI")
	if dbLink == "" {
		dbLink = "mongodb://localhost:27017"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "church_news_db"
	}

	clientOptions := options.Client().ApplyURI(dbLink)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)

	if err != nil {
		log.Fatal("Mongo Connect Error :", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Mongo Ping Error", err)

	}
	log.Println("Connected to MongoDB using URI:", dbLink)

	collectionName := os.Getenv("COLLECTION_NAME")
	if collectionName == "" {
		collectionName = "news"
	}

	NewsCollection = client.Database(dbName).Collection(collectionName)
	GalleryCollection = client.Database(dbName).Collection("gallery")
}
