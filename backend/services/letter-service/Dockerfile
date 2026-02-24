# Step 1: Base image
#FROM golang:1.24-alpine

# Step 2: Set working directory
#WORKDIR /app

# Step 3: Install required build tools
#RUN apk add --no-cache git bash ca-certificates

# Step 4: Install Air for live reload
#RUN go install github.com/cosmtrek/air@v1.40.4

# Step 5: Copy module files and download dependencies
#COPY go.mod go.sum ./
#ENV GOPROXY=https://proxy.golang.org,direct
#RUN go mod download

# Step 6: Copy the rest of the source code
#COPY . .

# Step 7: Expose service port
#EXPOSE 9002

# Step 8: Start service with Air
#CMD ["air"]