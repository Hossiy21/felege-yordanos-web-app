package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	failedAttempts = make(map[string]int)
	mutex          sync.Mutex
)

func LoginLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIp := c.ClientIP()
		mutex.Lock()
		count := failedAttempts[clientIp]
		mutex.Unlock()
		// here we count how many times they tired
		if count >= 5 {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Account locked due to too many failed attemps."})
			c.Abort()
			return
		}
		c.Next()
	}
}

func AddStrike(ip string) {
	mutex.Lock()
	failedAttempts[ip]++
	mutex.Unlock()
	go func() {
		time.Sleep(15 * time.Minute)
		mutex.Lock()
		if failedAttempts[ip] > 0 {
			failedAttempts[ip]--
		}
		mutex.Unlock()
	}()
}
func ResetStrikes(ip string) {
	mutex.Lock()
	delete(failedAttempts, ip)
	mutex.Unlock()
}
