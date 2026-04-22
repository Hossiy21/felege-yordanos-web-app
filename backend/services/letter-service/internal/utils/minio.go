package utils

import (
	"context"
	"log"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/cors"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var MinioClient *minio.Client

func InitMinio() {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	useSSL := os.Getenv("MINIO_USE_SSL") == "true"
	bucketName := os.Getenv("MINIO_BUCKET")

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalf("Error creating Minio client:  %v", err)
	}
	ctx := context.Background()
	exists, err := client.BucketExists(ctx, bucketName)
	if err != nil {
		log.Printf("Error checking bucket: %v ", err)
	}
	if !exists {
		err = client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Printf("Warning: Failed to create bucket (it might already exist): %v", err)
		} else {
			log.Printf("Successfully created bucket: %s", bucketName)
		}
	} else {
		log.Printf("Bucket %s already exists and is ready", bucketName)
	}

	// 3. Set Private Policy (only our service can access files)
	err = client.SetBucketPolicy(ctx, bucketName, "")
	if err != nil {
		log.Printf("Error setting private bucket policy: %v", err)
	} else {
		log.Printf("Bucket policy set to Private for: %s", bucketName)
	}

	// 4. Set CORS so browsers can fetch the PDF from port 9000
	corsConfig := cors.Config{
		CORSRules: []cors.Rule{
			{
				AllowedOrigin: []string{"*"},
				AllowedMethod: []string{"GET", "POST", "PUT"},
				AllowedHeader: []string{"*"},
				ExposeHeader:  []string{"Content-Length", "Content-Type", "Content-Disposition"},
				MaxAgeSeconds: 3600,
			},
		},
	}
	err = client.SetBucketCors(ctx, bucketName, &corsConfig)
	if err != nil {
		log.Printf("Warning: Failed to set CORS policy: %v", err)
	} else {
		log.Printf("CORS policy set for: %s", bucketName)
	}

	MinioClient = client

}
