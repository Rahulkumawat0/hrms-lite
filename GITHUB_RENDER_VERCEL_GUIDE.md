# Complete Deployment Guide - GitHub, Render & Vercel

## 🎯 Overview

This guide will walk you through:
1. **GitHub** - Upload your code to GitHub
2. **Render** - Deploy backend (Flask API)
3. **Vercel** - Deploy frontend (React app)

Estimated Time: **45 minutes**

---

## 📝 Part 1: Deploy Code to GitHub

### Step 1.1: Create GitHub Account (if you don't have one)

1. Go to https://github.com/signup
2. Sign up with your email
3. Verify your email
4. Complete setup

### Step 1.2: Create a New Repository on GitHub

1. Go to https://github.com/new
2. Fill in the form:
   - **Repository name**: `hrms-lite`
   - **Description**: `Human Resource Management System - Employee & Attendance Management`
   - **Visibility**: Select `Public` (required for live deployment)
   - **DO NOT** check "Initialize this repository with a README"
   - Check "Add .gitignore" and select "Python" from dropdown

3. Click **Create repository**

You'll see a page with instructions. **Keep this page open!**

### Step 1.3: Initialize Git Locally

Open **PowerShell** in your project root directory (or use terminal in VS Code):

```powershell
cd D:\2026\python-framework\human-resource-management-system
```

### Step 1.4: Configure Git (First Time Only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

Replace with your actual name and email.

### Step 1.5: Initialize Repository & Add Files

```powershell
git init
```

### Step 1.6: Add All Files to Git

```powershell
git add .
```

You should see files being staged (might take a few seconds).

### Step 1.7: Create Initial Commit

```powershell
git commit -m "Initial commit: HRMS Lite - Human Resource Management System"
```

Expected output: Shows files being committed.

### Step 1.8: Add Remote Repository

Copy the **HTTPS** URL from your GitHub repository page (looks like: `https://github.com/YOUR_USERNAME/hrms-lite.git`)

```powershell
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 1.9: Rename Branch to Main (if needed)

```powershell
git branch -M main
```

### Step 1.10: Push Code to GitHub

```powershell
git push -u origin main
```

This might ask for authentication. Follow the GitHub login flow.

**✅ Result**: Your code is now on GitHub!

**GitHub Repository URL**: 
```
https://github.com/YOUR_USERNAME/hrms-lite
```

---

## 🖥️ Part 2: Deploy Backend to Render

### Step 2.1: Create Render Account

1. Go to https://render.com
2. Click **Sign up**
3. Choose **Sign up with GitHub**
4. Click **Authorize render-oss**
5. Complete the signup

### Step 2.2: Create Web Service for Backend

1. From Render dashboard, click **New +**
2. Click **Web Service**
3. You'll see your GitHub repositories
4. Find and select **hrms-lite**
5. Click **Connect**

### Step 2.3: Configure Backend Service

Fill in the configuration:

| Field | Value |
|-------|-------|
| **Name** | `hrms-lite-backend` |
| **Environment** | `Python 3` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `python app.py` |

### Step 2.4: Add Environment Variables

Before clicking Create, scroll down to **Environment** section:

1. Click **Add Environment Variable**
2. Add these variables:

| Key | Value |
|-----|-------|
| `FLASK_ENV` | `production` |
| `FLASK_APP` | `app.py` |

### Step 2.5: Select Plan

- Choose **Free** plan (good for testing)
- Or upgrade later if needed

### Step 2.6: Click Create Web Service

Click the **Create Web Service** button.

Render will now:
- Build your Flask app
- Start the server
- Show you the deploy logs

### Step 2.7: Wait for Deployment

You'll see a screen showing deployment progress:
- Building... (takes 1-2 minutes)
- Deploying... (takes 30 seconds)
- Live ✓ (when complete)

### Step 2.8: Copy Your Backend URL

Once deployment is complete, you'll see a URL at the top like:
```
https://hrms-lite-backend.onrender.com
```

**Copy this URL** - you'll need it for the frontend!

### Step 2.9: Test Backend API

Open your browser and go to:
```
https://hrms-lite-backend.onrender.com/api/health
```

You should see:
```json
{"success": true, "message": "HRMS API is running"}
```

✅ **Backend is live!**

---

## 🎨 Part 3: Deploy Frontend to Vercel

### Step 3.1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Click **Continue with GitHub**
3. Authorize Vercel
4. Complete signup

### Step 3.2: Import Project to Vercel

1. From Vercel dashboard, click **Add New...**
2. Click **Project**
3. You'll see your GitHub repositories
4. Find and click **Import** next to **hrms-lite**

### Step 3.3: Configure Project

You'll see a configuration page:

1. **Framework Preset**: Select `React`
2. **Root Directory**: Click **Edit** and select `frontend`
   - Click the folder icon
   - Select `frontend`
   - Click ✓

3. **Build Command**: Should auto-fill as `npm run build`
4. **Output Directory**: Should auto-fill as `build`
5. **Install Command**: Should auto-fill as `npm install`

### Step 3.4: Set Environment Variables

This is **IMPORTANT**:

1. Scroll down to **Environment Variables**
2. Add a new variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: Paste your Render backend URL with `/api` at the end
   
   Example:
   ```
   https://hrms-lite-backend.onrender.com/api
   ```

3. Click **Add**

### Step 3.5: Deploy

1. Click **Deploy** button
2. Wait for deployment (takes 1-3 minutes)

You'll see:
- Building... ⏳
- Analyzing... ⏳
- Deploying... ⏳
- Success ✅

### Step 3.6: Get Your Frontend URL

Once deployment completes, you'll see your frontend URL:
```
https://hrms-lite.vercel.app
```

(Or similar - Vercel generates unique URLs)

### Step 3.7: Visit Your Live App

1. Open the frontend URL in your browser
2. You should see the HRMS Lite application

### Step 3.8: Test the Application

#### Test Employee Management:
1. Click **Employees** tab
2. Click **Add New Employee**
3. Fill in:
   - Employee ID: `EMP001`
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Department: `Engineering`
4. Click **Save Employee**
5. Verify employee appears in list

#### Test Attendance:
1. Click **Attendance** tab
2. Select the employee you just added
3. Select today's date
4. Select "Present"
5. Click **Record Attendance**
6. Verify it appears in the list

✅ **Frontend is live and working!**

---

## 🎉 Deployment Complete!

### Your Live URLs:

| Component | URL |
|-----------|-----|
| **Frontend** | `https://hrms-lite.vercel.app` |
| **Backend API** | `https://hrms-lite-backend.onrender.com/api` |
| **GitHub Code** | `https://github.com/YOUR_USERNAME/hrms-lite` |

---

## 📋 Verification Checklist

After deployment, verify everything works:

- [ ] Backend health check returns success
- [ ] Frontend loads without errors
- [ ] Can add employee successfully
- [ ] Can view employee list
- [ ] Can delete employee
- [ ] Can mark attendance
- [ ] Can view attendance records

---

## 🔄 Update Your Code in the Future

### To Update Backend or Frontend:

1. Make changes locally
2. Push to GitHub:
   ```powershell
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **Render & Vercel will automatically redeploy!**
   - Just push to GitHub
   - They'll detect changes and redeploy automatically
   - Takes 1-2 minutes

---

## 🆘 Troubleshooting

### Frontend Shows "Cannot Connect to API"

**Solution**:
1. Check Render deployment status (verify it's running)
2. Verify `REACT_APP_API_URL` is set correctly in Vercel
   - Go to Vercel project settings
   - Check Environment Variables
   - Ensure it has the correct Render backend URL
3. Trigger redeploy on Vercel:
   - Go to Deployments
   - Click the three dots on latest deployment
   - Click **Redeploy**

### Render Backend Not Running

**Solution**:
1. Go to Render dashboard
2. Click on **hrms-lite-backend** service
3. Check the logs (bottom of page)
4. Look for error messages
5. Common issue: Check if start command is correct

### Getting 404 Errors

**Solution**:
1. Check that API URL in frontend has `/api` at the end
2. Example correct URL: `https://hrms-lite-backend.onrender.com/api`
3. Verify in Vercel environment variables

### Vercel Build Failing

**Solution**:
1. Go to Vercel project
2. Click **Deployments**
3. Click failed deployment
4. Scroll down to see build logs
5. Look for error messages
6. Common fixes:
   - Check `package.json` has all dependencies
   - Run `npm install` locally to verify
   - Push changes and redeploy

---

## 💡 Pro Tips

### 1. Monitor Your Deployments
- **Render**: Go to service logs to see real-time output
- **Vercel**: Go to Deployments to see build history

### 2. Share Your Application
Use these URLs to share:
- **For users**: `https://hrms-lite.vercel.app`
- **For developers**: `https://github.com/YOUR_USERNAME/hrms-lite`

### 3. Pull Requests on GitHub
1. Create branch locally: `git checkout -b feature/my-feature`
2. Make changes
3. Push: `git push origin feature/my-feature`
4. Go to GitHub and create pull request

### 4. Custom Domain (Optional)
Both Vercel and Render support custom domains. See their docs for setup.

---

## 📊 Service Status

Check if your services are running:

1. **Vercel Status**: https://www.vercel.com/status
2. **Render Status**: https://status.render.com

---

## 🔐 Security Notes

✅ By default, services are HTTPS (secure)  
✅ API is public but validation is server-side  
✅ Database is SQLite (local to Render instance)  
✅ No sensitive data in environment variables yet  

Future improvements:
- Add API authentication
- Add database encryption
- Add rate limiting
- Add user authentication

---

## 📞 Support

If you get stuck:

1. **Check error logs**:
   - Render: Bottom of service page
   - Vercel: Deployments page, click failed build

2. **Common issues fixed in logs**:
   - Missing environment variables
   - Build command errors
   - Port and process issues

3. **Official documentation**:
   - Render Docs: https://render.com/docs
   - Vercel Docs: https://vercel.com/docs
   - GitHub Docs: https://docs.github.com

---

## ✨ Success!

Congratulations! Your HRMS Lite application is now:

✅ Deployed on GitHub (version control)  
✅ Deployed on Render (backend API running)  
✅ Deployed on Vercel (frontend running)  
✅ Publicly accessible  
✅ Auto-updating on code changes  

**Your application is live on the internet!** 🚀

---

**Deployment Date**: March 7, 2026  
**Status**: ✅ Production Deployed  
**Updated**: Ready for use

Share your live URL: `https://hrms-lite.vercel.app`
