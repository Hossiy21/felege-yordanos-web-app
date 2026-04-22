package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	uri := "mongodb://localhost:27017"
	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	collection := client.Database("church_letters_db").Collection("letters")

	// Print how many incoming letters exist
	filter1 := bson.M{"letter_type": "Incoming"}
	count1, _ := collection.CountDocuments(context.Background(), filter1)

	filter2 := bson.M{"letter_type": "incoming"}
	count2, _ := collection.CountDocuments(context.Background(), filter2)

	var filter3 = bson.M{"letter_type": "INCOMING"}
	count3, _ := collection.CountDocuments(context.Background(), filter3)

	fmt.Printf("Incoming (capitalized): %d, incoming (lowercase): %d, INCOMING (uppercase): %d\n", count1, count2, count3)

	// Delete all
	res1, err := collection.DeleteMany(context.Background(), filter1)
	if err != nil {
		log.Fatal(err)
	}
	res2, err := collection.DeleteMany(context.Background(), filter2)
	if err != nil {
		log.Fatal(err)
	}
	res3, err := collection.DeleteMany(context.Background(), filter3)
	if err != nil {
		log.Fatal(err)
	}

	total := res1.DeletedCount + res2.DeletedCount + res3.DeletedCount
	fmt.Printf("Successfully deleted %d incoming letters in total.\n", total)
}
