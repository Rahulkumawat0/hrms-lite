# Production Database Setup Guide

## Problem Overview
The original SQLite database (`sqlite:///hrms.db`) is **NOT suitable for production** because:
1. **Data Loss on Restart**: SQLite database files don't persist across server restarts on managed platforms like Render
2. **No Concurrency Support**: SQLite has poor handling of multiple concurrent requests
3. **No Scalability**: SQLite doesn't scale for production workloads

## Solution: Use PostgreSQL

### Why PostgreSQL?
- ✅ Persistent data storage (data survives server restarts)
- ✅ Full ACID compliance
- ✅ Excellent concurrency support
- ✅ Scales with your application
- ✅ Free tier available on Render and other platforms

### Step 1: Create PostgreSQL Database on Render

1. **Go to [render.com](https://render.com)** and sign in with your account
2. **Create New → PostgreSQL**
3. **Fill in the database details:**
   - Name: `hrms-db` (or your preferred name)
   - Region: Same as your backend service
   - PostgreSQL Version: 15 (latest)
4. **Create Database** - Wait for it to initialize
5. **Copy the External Database URL** - You'll need this for the backend

### Step 2: Update Render Backend Service

1. **Go to your HRMS backend service** on Render
2. **Settings → Environment Variables**
3. **Add new environment variable:**
   - Key: `DATABASE_URL`
   - Value: Paste the PostgreSQL URL from Step 1
   - Example: `postgresql://user:password@host.onrender.com:5432/dbname`

4. **For Render PostgreSQL, also add:**
   - Key: `FLASK_ENV`
   - Value: `production`

5. **Save and your backend will redeploy automatically**

### Step 3: Migrate Existing Data (Optional)

If you have data in SQLite that you want to move to PostgreSQL:

```bash
# On your local machine or in a terminal:

# 1. Export SQLite data
sqlite3 hrms.db ".dump" > export.sql

# 2. Set environment variable for PostgreSQL
export DATABASE_URL="postgresql://user:password@host:port/dbname"

# 3. Run migrations/create tables
python -c "from app import create_app; app = create_app(); app.app_context().push()"

# 4. Import data manually (you may need to adjust SQL syntax for PostgreSQL)
```

### Step 4: Verify Production Setup

1. **Deploy your updated code** with the new config.py and requirements.txt
2. **Test employee creation:**
   - Add a new employee through the web interface
   - Restart the backend service (or trigger a redeploy)
   - Verify the employee data is still there ✅

3. **Check logs:**
   - Go to Render → your backend service → Logs
   - Look for database connection messages
   - Ensure no connection errors

### Configuration Details

The updated `config.py` now:

```python
# Supports both development and production database URLs
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///hrms.db')

# Automatically converts postgres:// to postgresql://
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

# Adds connection pooling for production
SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True,
}
```

### Alternative: Other PostgreSQL Providers

If you don't want to use Render's PostgreSQL:

**Neon.tech** (Free tier available):
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the "Connection string" under "Connection details"
4. Set as `DATABASE_URL` in Render environment variables

**Amazon RDS**:
- Use for larger deployments
- Paid service, but reliable

## Troubleshooting

### "Error: could not translate host name to address"
- **Cause**: Database URL is incorrect or database is not accessible
- **Fix**: Double-check the DATABASE_URL in Render environment variables

### "SQLSTATE[HY000]: General error: 14 unable to open database file"
- **Cause**: Still using SQLite (old configuration)
- **Fix**: Ensure DATABASE_URL is set and config.py is using the new code

### "Employee data disappears after server restart"
- **Cause**: Using SQLite instead of PostgreSQL
- **Fix**: Follow Step 1-3 above to migrate to PostgreSQL

### "Connection pool timeout errors"
- **Cause**: Too many concurrent connections
- **Fix**: The new config includes pool settings that handle this automatically

## Summary of Changes Made

1. **EmployeeManagement.js**: Removed wasteful 30-second auto-refresh interval
   - Employees now load only when:
     - Component first mounts
     - Refresh button is clicked
     - New employee is added/deleted

2. **config.py**: Updated to support production databases
   - Uses environment variable `DATABASE_URL` for Render/production
   - Falls back to SQLite for local development
   - Includes connection pooling for production

3. **requirements.txt**: Added `psycopg2-binary` for PostgreSQL support

## Next Steps

1. ✅ Deploy updated backend code
2. ✅ Create PostgreSQL database on Render
3. ✅ Set DATABASE_URL environment variable
4. ✅ Redeploy backend (automatic on Render)
5. ✅ Test by adding employee and verifying persistence

Your HRMS will now have **persistent data storage** that survives restarts and deployments! 🎉
