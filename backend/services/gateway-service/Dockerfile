# Use the version from your go.mod
#FROM golang:1.24-alpine

# Install git and certificates (good for security and dependencies)
#RUN apk add --no-cache git ca-certificates

#WORKDIR /app

# 1. Copy go.mod and go.sum first to cache dependencies
#COPY go.mod go.sum ./
#RUN go mod download

# 2. Copy the rest of the gateway source code
#COPY . .

# 3. Build the gateway binary
#RUN go build -o gateway-binary .

# 4. Expose the "Front Door" port
#EXPOSE 8000

# 5. Run the service
#CMD ["./gateway-binary"]