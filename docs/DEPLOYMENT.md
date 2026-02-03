# Life OS - Deployment Guide

Complete guide for deploying Life OS to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [Vercel Deployment](#vercel-deployment)
6. [Production Checklist](#production-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

Before deploying, ensure you have:

- Node.js 20+ installed
- Docker and Docker Compose (for containerized deployment)
- Supabase project set up
- Domain name (for production)
- SSL certificate (Let's Encrypt recommended)

## Environment Setup

### 1. Required Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Security
JWT_SECRET=[random-256-bit-string]
JWT_EXPIRES_IN=24h

# AI Integration
GROQ_API_KEY=[your-groq-api-key]

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://[key]@sentry.io/[project]

# App Configuration
NODE_ENV=production
PORT=3000
```

### 2. Supabase Configuration

1. Create a new Supabase project
2. Run the database migrations:
   ```bash
   npm run supabase:migrate
   ```
3. Set up Row Level Security (RLS) policies
4. Enable email authentication
5. Configure OAuth providers (optional)

### 3. Generate SEO Files

```bash
npm run seo:generate
```

This generates:
- `public/sitemap.xml` - Site map for search engines
- `public/robots.txt` - Robots directives

## Local Development

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Deployment

### Quick Start

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down
```

### Production Deployment Steps

1. **Prepare the server:**
   ```bash
   # Install Docker and Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Copy project files:**
   ```bash
   scp -r . user@server:/opt/life-os
   ssh user@server "cd /opt/life-os && docker-compose up -d"
   ```

3. **Configure SSL with Let's Encrypt:**
   ```bash
   # Install certbot
   sudo apt install certbot
   
   # Generate certificate
   sudo certbot certonly --standalone -d life-os.app
   
   # Copy certificates to nginx
   sudo cp /etc/letsencrypt/live/life-os.app/fullchain.pem /opt/life-os/nginx/ssl/cert.pem
   sudo cp /etc/letsencrypt/live/life-os.app/privkey.pem /opt/life-os/nginx/ssl/key.pem
   ```

4. **Set up auto-renewal:**
   ```bash
   # Add to crontab
   0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook "docker-compose -f /opt/life-os/docker-compose.yml restart nginx"
   ```

### Docker Commands Reference

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Rebuild containers
docker-compose up -d --build

# Execute commands in container
docker-compose exec app sh

# Update images
docker-compose pull && docker-compose up -d

# Clean up unused data
docker system prune -a
```

## Vercel Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. Add `vercel.json` configuration:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://api.life-os.app/api/$1" }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
           { "key": "X-Content-Type-Options", "value": "nosniff" }
         ]
       }
     ]
   }
   ```

### Backend (Separate Server)

Deploy the Express API separately on a VPS or use serverless functions.

## Production Checklist

### Security

- [ ] Environment variables secured (no secrets in repo)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Database RLS policies active
- [ ] JWT secrets rotated
- [ ] API keys secured

### Performance

- [ ] Code-splitting enabled
- [ ] Images optimized
- [ ] Gzip/Brotli compression enabled
- [ ] CDN configured for static assets
- [ ] Cache headers set correctly
- [ ] Database indexes optimized

### SEO

- [ ] Sitemap.xml generated and submitted to Google
- [ ] Robots.txt configured
- [ ] Meta tags implemented
- [ ] Canonical URLs set
- [ ] Structured data (JSON-LD) added
- [ ] Social media preview images created

### Monitoring

- [ ] Google Analytics configured
- [ ] Sentry error tracking enabled
- [ ] Health check endpoint active
- [ ] Log aggregation set up
- [ ] Alerting configured

### Backups

- [ ] Database automated backups enabled
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

## Monitoring & Maintenance

### Health Checks

The application exposes a health endpoint:

```bash
curl https://life-os.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "2.0.0",
  "services": {
    "database": "connected",
    "api": "running"
  }
}
```

### Log Management

View application logs:
```bash
# Docker logs
docker-compose logs -f app

# Nginx access logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# Nginx error logs
docker-compose exec nginx tail -f /var/log/nginx/error.log
```

### Updating the Application

```bash
# Pull latest code
git pull origin main

# Regenerate SEO files
npm run seo:generate

# Rebuild and restart
docker-compose up -d --build

# Run database migrations (if needed)
docker-compose exec app npm run db:migrate
```

### Scaling

To scale horizontally:

1. Update docker-compose.yml:
   ```yaml
   deploy:
     replicas: 3
   ```

2. Add load balancer configuration

3. Use external database (Managed PostgreSQL)

### Troubleshooting

**Container won't start:**
```bash
docker-compose logs app
```

**Database connection issues:**
```bash
# Check Supabase connection
curl $SUPABASE_URL/rest/v1/
```

**High memory usage:**
```bash
# Check container stats
docker stats

# Restart containers
docker-compose restart
```

## Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Test database connectivity
4. Review firewall rules
5. Check SSL certificate validity

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
