package proxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

func NewProxy(target string) gin.HandlerFunc {
	return func(c *gin.Context) {
		remote, err := url.Parse(target)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid target URL"})
			return
		}
		proxy := httputil.NewSingleHostReverseProxy(remote)
		proxy.Director = func(req *http.Request) {
			req.Header = c.Request.Header
			req.Host = remote.Host
			req.URL.Scheme = remote.Scheme
			req.URL.Host = remote.Host
			path := c.Param("proxyPath")
			if !strings.HasPrefix(path, "/") {
				path = "/" + path
			}
			req.URL.Path = remote.Path + path
			req.URL.RawQuery = c.Request.URL.RawQuery
		}
		proxy.ServeHTTP(c.Writer, c.Request)
	}
}
