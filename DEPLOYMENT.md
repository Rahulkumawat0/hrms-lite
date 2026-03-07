# HRMS Lite - Deployment Guide

## ✅ Deployment Status: LIVE IN PRODUCTION

**Frontend**: https://hrms-lite-nine-sage.vercel.app/
**Backend API**: https://hrms-lite-qan7.onrender.com/api
**GitHub**: https://github.com/Rahulkumawat0/hrms-lite

HRMS Lite is fully deployed and running in production. This guide documents the deployment process.

## Prerequisites (Already Completed)

- ✅ GitHub Account
- ✅ Render Account (backend deployed)
- ✅ Vercel Account (frontend deployed)

## Part 1: GitHub Repository Setup

### 1. Initialize Git Repository

```bash
cd human-resource-management-system
git init
git add .
git commit -m "Initial commit: HRMS Lite application"
```

### 2. Create Repository on GitHub

1. Go to https://github.com/new
2. Name: `hrms-lite`
3. Description: "Human Resource Management System - HRMS Lite"
4. Choose Public (for live URL requirements)
5. Click "Create repository"

### 3. Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
git branch -M main
git push -u origin main
```

## Part 2: Backend Deployment (Render)

### 1. Prepare Backend for Deployment

Create `backend/Procfile` (if not using Render's settings):
```
web: python app.py
```

Update `backend/config.py`:
```python
import os

class Config:
    """Base configuration"""
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///hrms.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'hrms-secret-key-2026')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig
    return DevelopmentConfig
```

### 2. Deploy on Render

1. Go to https://render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Select GitHub repository
5. Configure:
   - **Name**: hrms-lite-backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
6. Add Environment Variables:
   - `FLASK_ENV=production`
   - `FLASK_APP=app.py`
7. Click "Deploy"

### 3. Get Backend URL

After deployment, note the URL (e.g., https://hrms-lite-backend.onrender.com)

## Part 3: Frontend Deployment (Vercel)

### 1. Prepare Frontend for Production

Create `.env.production`:
```
REACT_APP_API_URL=https://hrms-lite-backend.onrender.com/api
```

Update `frontend/package.json` to include build script (already configured).

### 2. Deploy on Vercel

#### Option A: Using Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel
```

#### Option B: Using GitHub Integration
1. Go to https://vercel.com
2. Sign up/Login
3. Click "Import Project"
4. Select GitHub repository
5. Configure:
   - **Framework Preset**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variable:
   - `REACT_APP_API_URL=https://hrms-lite-backend.onrender.com/api`
7. Click "Deploy"

### 3. Get Frontend URL

After deployment, note the URL (e.g., https://hrms-lite.vercel.app)

## Part 4: Update Environment Variables

### Update Frontend .env
```
REACT_APP_API_URL=https://hrms-lite-backend.onrender.com/api
```

## Part 5: Testing Live Application

1. Visit frontend URL: `https://hrms-lite.vercel.app`
2. Test Employee Management:
   - Add new employee
   - View employee list
   - Delete employee
3. Test Attendance Management:
   - Select employee
   - Mark attendance
   - View attendance records

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Backend URL updated in frontend .env
- [ ] CORS enabled in backend
- [ ] Database initialized on backend
- [ ] All APIs tested with live URLs
- [ ] Environment variables set correctly
- [ ] Application accessible from live URLs

## Alternative Cloud Providers

### Backend Hosting
- **Heroku** (https://www.heroku.com)
- **Railway** (https://railway.app)
- **PythonAnywhere** (https://www.pythonanywhere.com)
- **AWS** (EC2 + RDS)

### Frontend Hosting
- **Netlify** (https://www.netlify.com)
- **GitHub Pages** (https://pages.github.com)
- **AWS S3 + CloudFront**
- **Firebase Hosting**

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify environment variables are set
- Confirm Flask is running on port 5000
- Test health endpoint: `/api/health`

### Frontend Issues
- Check Vercel logs for build errors
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for CORS errors
- Clear browser cache and rebuild

## Database Migration

For production, consider migrating from SQLite to PostgreSQL:

1. On Render, create PostgreSQL database
2. Get connection string
3. Update `DATABASE_URL` environment variable
4. Update `requirements.txt` to include `psycopg2-binary`

## Scaling Considerations

- Add load balancing (Render handles this)
- Set up database backups
- Monitor API performance
- Implement rate limiting if needed
- Consider caching for frequently accessed data

## Security Improvements

- [ ] Add authentication layer
- [ ] Implement HTTPS (auto on Vercel/Render)
- [ ] Add API rate limiting
- [ ] Validate and sanitize all inputs
- [ ] Use environment variables for secrets
- [ ] Enable database encryption
- [ ] Add API key authentication

## Live Deployment URLs

Once deployed, update this section:

**Frontend URL**: https://[your-frontend-url].vercel.app  
**Backend API**: https://[your-backend-url].onrender.com/api  
**GitHub Repository**: https://github.com/[your-username]/hrms-lite

---

**Last Updated**: March 7, 2026  
**Deployment Status**: Ready for Production
