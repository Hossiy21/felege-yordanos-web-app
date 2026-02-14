package handlers

import (
	"church-system/internal/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetSystemStatsHandler(c *gin.Context) {
	type Stats struct {
		TotalLetters     int            `json:"total_letters"`
		StatusCounts     map[string]int `json:"status_counts"`
		TotalUsers       int            `json:"total_users"`
		TotalDepartments int            `json:"total_departments"`
	}

	var s Stats
	s.StatusCounts = make(map[string]int)
	ctx := c.Request.Context()

	// fetch letter counts grouped by status
	query := `select status,count(*) from letters where deleted_at is null group by status`
	rows, err := database.Conn.Query(ctx, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats"})
		return
	}
	defer rows.Close()
	for rows.Next() {
		var status string
		var count int
		if err := rows.Scan(&status, &count); err == nil {
			s.StatusCounts[status] = count
			s.TotalLetters += count
		}
	}
	userFetcher := `select count(*) from users`
	depFetcher := `select count(*) from departments`
	database.Conn.QueryRow(ctx, userFetcher).Scan(&s.TotalUsers)
	database.Conn.QueryRow(ctx, depFetcher).Scan(&s.TotalDepartments)
	c.JSON(http.StatusOK, s)
}
