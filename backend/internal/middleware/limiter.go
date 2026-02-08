package middleware

import (
	"time"

	"github.com/didip/tollbooth/v7"
	"github.com/didip/tollbooth/v7/limiter"
	"github.com/didip/tollbooth_gin"
	"github.com/gin-gonic/gin"
)

func RateLimiter() gin.HandlerFunc {
	lmt := tollbooth.NewLimiter(5, &limiter.ExpirableOptions{DefaultExpirationTTL: time.Hour})
	lmt.SetMessage("Too many login attempts. Please wait 1 minute and try again..")
	lmt.SetIPLookups([]string{"RemoteAddr", "X-Forwarded-For", "x-Real-IP"})
	return tollbooth_gin.LimitHandler(lmt)
}
