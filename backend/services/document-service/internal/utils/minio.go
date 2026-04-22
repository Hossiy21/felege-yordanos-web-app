package utils

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var MinioClient *minio.Client

func InitMinio() {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	if endpoint == "" {
		endpoint = "localhost:9000"
	}
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	if accessKey == "" {
		accessKey = "admin"
	}
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	if secretKey == "" {
		secretKey = "bole@123"
	}
	useSSL := os.Getenv("MINIO_USE_SSL") == "true"
	bucketName := os.Getenv("MINIO_BUCKET")
	if bucketName == "" {
		bucketName = "church-documents"
	}

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalf("Error creating Minio client: %v", err)
	}

	ctx := context.Background()
	exists, err := client.BucketExists(ctx, bucketName)
	if err != nil {
		log.Printf("Error checking bucket %s: %v", bucketName, err)
	}
	if !exists {
		err = client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Printf("Warning: Failed to create bucket %s: %v", bucketName, err)
		} else {
			log.Printf("Successfully created bucket: %s", bucketName)
		}
	}

	// Set public policy for easy viewing
	policy := fmt.Sprintf(`{
		"Version": "2012-10-17",
		"Statement": [
			{
				"Effect": "Allow",
				"Principal": {"AWS": ["*"]},
				"Action": ["s3:GetObject"],
				"Resource": ["arn:aws:s3:::%s/*"]
			}
		]
	}`, bucketName)

	err = client.SetBucketPolicy(ctx, bucketName, policy)
	if err != nil {
		log.Printf("Error setting public bucket policy: %v", err)
	}

	MinioClient = client
}
