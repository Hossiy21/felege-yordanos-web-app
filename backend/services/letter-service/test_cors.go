package main

import (
	"fmt"
	"github.com/minio/minio-go/v7/pkg/cors"
)

func main() {
	c := cors.Config{
		CORSRules: []cors.Rule{
			{
				AllowedOrigins: []string{"*"},
			},
		},
	}
	fmt.Println(c)
}
