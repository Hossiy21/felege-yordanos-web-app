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
		bucketName = "news"
	}

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalf("Error creating Minio client: %v", err)
	}

	ctx := context.Background()
	buckets := []string{bucketName, "gallery"}

	for _, b := range buckets {
		exists, err := client.BucketExists(ctx, b)
		if err != nil {
			log.Printf("Error checking bucket %s: %v", b, err)
		}
		if !exists {
			err = client.MakeBucket(ctx, b, minio.MakeBucketOptions{})
			if err != nil {
				log.Printf("Warning: Failed to create bucket %s: %v", b, err)
			} else {
				log.Printf("Successfully created bucket: %s", b)
			}
		}

		// Set public policy
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
		}`, b)

		err = client.SetBucketPolicy(ctx, b, policy)
		if err != nil {
			log.Printf("Error setting public bucket policy for %s: %v", b, err)
		}
	}

	MinioClient = client
}
