# SST Manager - Deployment Guide

This guide provides step-by-step instructions for deploying the SST Manager application in various environments.

## Prerequisites

### System Requirements
- **OS**: Linux/Windows/macOS
- **CPU**: 2+ cores
- **RAM**: 4GB+ minimum, 8GB+ recommended
- **Storage**: 20GB+ free space
- **Network**: Stable internet connection

### Software Requirements
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.30+
- **Node.js**: 18+ (for frontend builds)
- **Go**: 1.24+ (for backend builds)

## Quick Start Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/sst-manager.git
cd sst-manager
```

### 2. Environment Configuration
Create environment files:

**backend/.env**
```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_management_db

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here_minimum_32_chars

# MinIO Configuration
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your_secure_minio_password_here

# Service Ports
PORT=8080
NEWS_PORT=8081
LETTERS_PORT=8082
MEETINGS_PORT=8083

# Environment
GIN_MODE=release
NODE_ENV=production
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MINIO_URL=http://localhost:9000
```

### 3. Start Services
```bash
# Start databases and infrastructure
cd backend
docker-compose up -d

# Wait for databases to be ready
sleep 30

# Start microservices
./scripts/start-services.sh

# Build and start frontend
cd ../frontend
npm run build
npm start
```

## Production Deployment

### Docker Compose Production Setup

**docker-compose.prod.yml**
```yaml
version: '3.9'

services:
  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - sst-network
    restart: unless-stopped

  # MongoDB
  mongodb:
    image: mongo:7-jammy
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    networks:
      - sst-network
    restart: unless-stopped

  # MinIO
  minio:
    image: quay.io/minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    networks:
      - sst-network
    restart: unless-stopped

  # Redis (for caching)
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - sst-network
    restart: unless-stopped

  # Gateway Service
  gateway:
    build:
      context: ./services/gateway-service
      dockerfile: Dockerfile.prod
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
    ports:
      - "80:8000"
    depends_on:
      - postgres
      - redis
    networks:
      - sst-network
    restart: unless-stopped

  # Auth Service
  auth-service:
    build:
      context: ./services/auth-service
      dockerfile: Dockerfile.prod
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    networks:
      - sst-network
    restart: unless-stopped

  # News Service
  news-service:
    build:
      context: ./services/news-service
      dockerfile: Dockerfile.prod
    environment:
      - MONGO_HOST=mongodb
      - MINIO_HOST=minio
    depends_on:
      - mongodb
      - minio
    networks:
      - sst-network
    restart: unless-stopped

  # Letter Service
  letter-service:
    build:
      context: ./services/letter-service
      dockerfile: Dockerfile.prod
    environment:
      - MONGO_HOST=mongodb
      - MINIO_HOST=minio
    depends_on:
      - mongodb
      - minio
    networks:
      - sst-network
    restart: unless-stopped

  # Meeting Service
  meeting-service:
    build:
      context: ./services/meeting-service
      dockerfile: Dockerfile.prod
    environment:
      - MONGO_HOST=mongodb
      - MINIO_HOST=minio
    depends_on:
      - mongodb
      - minio
    networks:
      - sst-network
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    networks:
      - sst-network
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - gateway
      - frontend
    networks:
      - sst-network
    restart: unless-stopped

volumes:
  postgres_data:
  mongodb_data:
  minio_data:
  redis_data:

networks:
  sst-network:
    driver: bridge
```

### Production Dockerfile Examples

**services/gateway-service/Dockerfile.prod**
```dockerfile
FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

**frontend/Dockerfile.prod**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### Nginx Configuration

**nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream gateway_backend {
        server gateway:8000;
    }

    upstream frontend_backend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # API routes
        location /api/ {
            proxy_pass http://gateway_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Auth routes
        location /auth/ {
            proxy_pass http://gateway_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Storage routes
        location /storage/ {
            proxy_pass http://gateway_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Frontend routes
        location / {
            proxy_pass http://frontend_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## Cloud Deployment

### AWS Deployment

#### 1. EC2 Setup
```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --count 1 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-groups sst-manager-sg

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### 2. RDS PostgreSQL
```bash
aws rds create-db-instance \
  --db-instance-identifier sst-manager-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20
```

#### 3. DocumentDB (MongoDB)
```bash
aws docdb create-db-cluster \
  --db-cluster-identifier sst-manager-docdb \
  --engine docdb \
  --master-username admin \
  --master-user-password your-password
```

#### 4. S3 (MinIO alternative)
```bash
aws s3 mb s3://sst-manager-storage
```

### Google Cloud Platform

#### 1. GKE Cluster
```bash
gcloud container clusters create sst-manager-cluster \
  --num-nodes=3 \
  --machine-type=e2-medium \
  --zone=us-central1-a
```

#### 2. Cloud SQL (PostgreSQL)
```bash
gcloud sql instances create sst-manager-postgres \
  --database-version=POSTGRES_15 \
  --cpu=1 \
  --memory=4GB \
  --region=us-central1
```

#### 3. Cloud Storage
```bash
gsutil mb gs://sst-manager-storage
```

### Azure Deployment

#### 1. AKS Cluster
```bash
az aks create \
  --resource-group sst-manager-rg \
  --name sst-manager-cluster \
  --node-count 3 \
  --node-vm-size Standard_B2s \
  --enable-addons monitoring \
  --generate-ssh-keys
```

#### 2. Azure Database for PostgreSQL
```bash
az postgres server create \
  --resource-group sst-manager-rg \
  --name sst-manager-postgres \
  --location eastus \
  --admin-user admin \
  --admin-password your-password \
  --sku-name B_Gen5_1 \
  --version 15
```

## Monitoring & Observability

### Health Checks
```bash
# Application health
curl http://localhost:8000/health

# Database health
docker exec sst-manager_postgres_1 pg_isready -h localhost

# Service health
curl http://localhost:8080/health
```

### Logging
```bash
# View service logs
docker-compose logs -f gateway

# View all logs
docker-compose logs

# Log aggregation with ELK
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 elasticsearch:7.10.0
docker run -d --name logstash -p 5044:5044 logstash:7.10.0
docker run -d --name kibana -p 5601:5601 kibana:7.10.0
```

### Monitoring Setup
```bash
# Prometheus
docker run -d --name prometheus -p 9090:9090 prom/prometheus

# Grafana
docker run -d --name grafana -p 3001:3000 grafana/grafana

# Application metrics
curl http://localhost:8000/metrics
```

## Backup & Recovery

### Database Backup
```bash
# PostgreSQL backup
docker exec sst-manager_postgres_1 pg_dump -U postgres church_management_db > backup.sql

# MongoDB backup
docker exec sst-manager_mongodb_1 mongodump --out /backup

# MinIO backup
mc mirror local/bucket s3/backup-bucket/
```

### Automated Backups
```bash
# Create backup script
cat > backup.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)

# PostgreSQL
docker exec sst-manager_postgres_1 pg_dump -U postgres church_management_db > postgres_$DATE.sql

# MongoDB
docker exec sst-manager_mongodb_1 mongodump --out /backup/mongodb_$DATE

# MinIO
mc mirror local/bucket s3/backup-bucket/backup_$DATE/

# Compress and upload to cloud
tar -czf backup_$DATE.tar.gz postgres_$DATE.sql mongodb_$DATE
aws s3 cp backup_$DATE.tar.gz s3://sst-manager-backups/
EOF

# Schedule with cron
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## Security Hardening

### SSL/TLS Configuration
```bash
# Generate SSL certificate
certbot certonly --standalone -d your-domain.com

# Configure SSL in nginx
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### Environment Variables
```bash
# Use strong secrets
export JWT_SECRET="$(openssl rand -hex 32)"
export DB_PASSWORD="$(openssl rand -hex 16)"
export MINIO_ROOT_PASSWORD="$(openssl rand -hex 16)"
```

## Scaling

### Horizontal Scaling
```bash
# Scale services
docker-compose up -d --scale auth-service=3
docker-compose up -d --scale news-service=2

# Load balancer configuration
upstream backend {
    server auth-service-1:8080;
    server auth-service-2:8080;
    server auth-service-3:8080;
}
```

### Database Scaling
```bash
# PostgreSQL read replicas
aws rds create-db-instance-read-replica \
  --db-instance-identifier sst-manager-replica \
  --source-db-instance-identifier sst-manager-postgres

# MongoDB sharding
mongosh --eval "sh.enableSharding('sstmanager')"
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database status
docker-compose ps

# View database logs
docker-compose logs postgres

# Test connection
docker exec -it sst-manager_postgres_1 psql -U postgres -d church_management_db
```

#### Service Startup Issues
```bash
# Check service logs
docker-compose logs gateway

# Restart service
docker-compose restart gateway

# Rebuild service
docker-compose up -d --build gateway
```

#### Memory Issues
```bash
# Check memory usage
docker stats

# Increase memory limits
docker-compose.yml:
services:
  gateway:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

#### Performance Issues
```bash
# Enable profiling
export GIN_MODE=release

# Database query optimization
docker exec -it sst-manager_postgres_1 psql -U postgres -d church_management_db
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

## Maintenance

### Updates
```bash
# Update images
docker-compose pull

# Rolling update
docker-compose up -d --no-deps gateway

# Zero-downtime deployment
docker-compose up -d --scale gateway=2
# Wait for new instances
docker-compose up -d --scale gateway=1
```

### Cleanup
```bash
# Remove unused images
docker image prune -f

# Remove unused volumes
docker volume prune -f

# Remove stopped containers
docker container prune -f
```

## Support

For deployment support:
- Check logs: `docker-compose logs`
- Health checks: `curl http://localhost:8000/health`
- Documentation: https://docs.sstmanager.com/deployment
- Community: https://github.com/sstmanager/deployment/discussions