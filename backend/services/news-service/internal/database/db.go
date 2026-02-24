package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Env struct {
	NewsCol *mongo.Collection
}

var NewsCollection *mongo.Collection

func InitMongo() {
	dbLink := "mongodb://content-db:27017"
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
	log.Println("Connected to MongoDB")
	const (
		dbName         = "church_news_db"
		collectionName = "news"
	)
	NewsCollection = client.Database(dbName).Collection(collectionName)
}
