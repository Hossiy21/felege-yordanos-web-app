package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func RecordAudit(email string, action string) {
	authUrl := os.Getenv("AUTH_SERVICE_URL")
	if authUrl == "" {
		authUrl = "http://localhost:8080"
	}

	payload := map[string]string{
		"admin_email": email,
		"action":      action,
	}
	jsonData, _ := json.Marshal(payload)

	url := fmt.Sprintf("%s/internal/audit", authUrl)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("Audit Log Error: Failed to record audit for %s: %v\n", action, err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Audit Log Error: Auth service returned status %d for audit log\n", resp.StatusCode)
	}
}
