# HRMS Lite - Human Resource Management System

A modern, full-stack web application for managing employee records and attendance tracking with production-ready data persistence.

## 🌐 Live Application

**Frontend**: [https://hrms-lite-nine-sage.vercel.app/](https://hrms-lite-nine-sage.vercel.app/)

**Backend API**: [https://hrms-lite-qan7.onrender.com/api](https://hrms-lite-qan7.onrender.com/api)

**GitHub Repository**: [https://github.com/Rahulkumawat0/hrms-lite](https://github.com/Rahulkumawat0/hrms-lite)

## 📋 Overview

HRMS Lite is a comprehensive HR management solution that allows administrators to:
- **Manage Employees**: Add, view, and delete employee records with validation
- **Track Attendance**: Mark and view employee attendance with date-based sorting
- **Persistent Data**: Automatic data persistence across server restarts

Built with:
- **Backend**: Python Flask with SQLAlchemy ORM
- **Frontend**: React 18 with Axios HTTP client
- **Database**: SQLite (development) or PostgreSQL (production)
- **API**: RESTful API with comprehensive validation and error handling
- **Deployment**: Render (Backend with PostgreSQL), Vercel (Frontend)
- **Status**: Production Ready with Data Persistence

## 🎯 Features

### Employee Management
✅ Add new employees with unique Employee ID, email, and department  
✅ View all employees in a responsive table  
✅ Delete employees with confirmation dialogs  
✅ Email format validation  
✅ Prevent duplicate employee IDs and emails  
✅ Support for multiple departments  

### Attendance Management
✅ Mark attendance for employees (Present/Absent)  
✅ View attendance records with automatic date-based sorting (newest first)  
✅ Prevent duplicate attendance entries (updates if already marked)  
✅ View attendance records by employee or all records  
✅ Date filtering and instant list updates  

### Technical Features
✅ RESTful API with proper HTTP status codes  
✅ Comprehensive input validation and error handling  
✅ CORS enabled for cross-origin requests  
✅ Responsive design for all devices  
✅ Loading, empty, and error state management  
✅ Optimized performance with removed auto-refresh inefficiencies  
✅ Production-ready database support with PostgreSQL  

## 📁 Project Structure

```
human-resource-management-system/
├── backend/                        # Flask API Server
│   ├── app.py                     # Main Flask application
│   ├── config.py                  # Database configuration (SQLite/PostgreSQL)
│   ├── models.py                  # SQLAlchemy database models
│   ├── requirements.txt            # Python dependencies
│   ├── render.yaml                # Render deployment configuration
│   ├── Procfile                   # Heroku/Render process file
│   ├── seed_data.py               # Sample data seeding script
│   ├── .env                       # Environment variables (not in git)
│   ├── .gitignore                 # Git ignore rules
│   └── README.md                  # Backend documentation
│
└── frontend/                      # React Frontend Application
    ├── public/
    │   └── index.html             # Main HTML entry point
    ├── src/
    │   ├── components/            # React components
    │   │   ├── AddEmployee.js
    │   │   ├── EditEmployee.js
    │   │   ├── EmployeeList.js
    │   │   ├── EmployeeManagement.js
    │   │   ├── AttendanceForm.js
    │   │   ├── AttendanceList.js
    │   │   ├── AttendanceManagement.js
    │   │   └── Analytics.js
    │   ├── styles/                # CSS stylesheets
    │   │   └── App.css
    │   ├── App.js                 # Main App component
    │   └── index.js               # React entry point
    ├── package.json               # NPM dependencies and scripts
    ├── vercel.json                # Vercel deployment configuration
    ├── .env.example               # Example environment variables
    ├── .gitignore                 # Git ignore rules
    └── README.md                  # Frontend documentation
```

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (for development):
```bash
FLASK_ENV=development
DATABASE_URL=sqlite:///hrms.db
```

5. Run the Flask server:
```bash
python app.py
```

Server will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```
Update with your API base URL (e.g., `REACT_APP_API_URL=http://localhost:5000/api`)

4. Start the development server:
```bash
npm start
```

Application will open at `http://localhost:3000`

## 🗄️ Database Configuration

### Development (SQLite)
- Automatically uses SQLite for local development
- Database file: `hrms.db` in the backend directory
- No additional setup required

### Production (PostgreSQL)

For Render deployment with data persistence:

1. Create PostgreSQL database on Render
2. Set `DATABASE_URL` environment variable in Render backend service:
   ```
   DATABASE_URL=postgresql://username:password@host:port/dbname
   ```
3. The backend automatically detects and uses PostgreSQL when `DATABASE_URL` is set
4. Data persists across server restarts and redeployments

**Important**: SQLite is ephemeral on hosted services and loses data on restart. Always use PostgreSQL for production.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Employee Endpoints

**Get All Employees**
```
GET /employees
Response: Array of employee objects
```

**Create Employee**
```
POST /employees
Content-Type: application/json

Request Body:
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}

Response:
{
  "success": true,
  "message": "Employee added successfully",
  "data": {...}
}
```

**Get Specific Employee**
```
GET /employees/{id}
Response: Single employee object
```

**Delete Employee**
```
DELETE /employees/{id}
Response:
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

### Attendance Endpoints

**Get All Attendance Records (Sorted by Date DESC)**
```
GET /attendance
Response: Array of attendance objects sorted by date (newest first)
```

**Mark Attendance**
```
POST /attendance
Content-Type: application/json

Request Body:
{
  "employee_id": 1,
  "date": "2026-03-14",
  "status": "Present"
}

Response:
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {...}
}
```

**Get Employee Attendance (Sorted by Date DESC)**
```
GET /employees/{id}/attendance
Response: Array of attendance records for the employee sorted by date (newest first)
```

### Health Check
```
GET /api/health
Response:
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🎨 Design & UI

- **Color Scheme**: Modern gradient purple (#667eea to #764ba2)
- **Typography**: Segoe UI / System fonts for professional appearance
- **Layout**: Responsive Bootstrap-based grid system
- **Icons**: Font Awesome 6 for intuitive navigation
- **States**: 
  - Loading spinners during data fetch
  - Empty state messages
  - Error messages with actionable feedback
  - Success confirmations

## 🔐 Validation

### Employee Validation
- Employee ID: Unique, required, alphanumeric
- Full Name: Required, text only
- Email: Required, valid email format, unique across system
- Department: Required, selected from predefined list

### Attendance Validation
- Employee ID: Must exist in system
- Date: Required, YYYY-MM-DD format
- Status: Must be "Present" or "Absent"
- Duplicate Prevention: Updates existing record if date already marked

## 📱 Responsive Design

- **Desktop (1920px+)**: Full-width layout with expanded details
- **Laptop (1024px-1920px)**: Optimized two-column layout
- **Tablet (768px-1024px)**: Stack layout with touch-friendly buttons
- **Mobile (<768px)**: Single column, collapsible sections

## 🌐 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Error Handling

All API endpoints return consistent JSON responses:

**Success Response**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Specific error 1", "Specific error 2"]
}
```

**Common HTTP Status Codes**
- 200: Success
- 201: Created
- 400: Bad Request / Validation Error
- 404: Not Found
- 409: Conflict (duplicate entry)
- 500: Server Error

## 🔄 Data Flow

1. User interacts with React frontend component
2. Frontend validates input locally
3. Frontend sends HTTP request to Flask API
4. Flask validates request data and checks business rules
5. SQLAlchemy ORM executes database operations
6. Flask returns JSON response
7. Frontend processes response and updates UI
8. User sees updated data/confirmation

## 🚢 Deployment & Configuration

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect to your GitHub repository
4. Configure environment variables:
   - `FLASK_ENV`: Set to `production`
   - `DATABASE_URL`: PostgreSQL connection string
5. Deploy

The backend automatically listens on the Render-assigned port.

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables:
   - `REACT_APP_API_URL`: Your Render API URL
4. Deploy (automatic on push)

## 📊 Recent Updates (March 2026)

### Fixed Issues:
- ✅ **Employee Data Loading**: Removed wasteful 30-second auto-refresh, significantly improving performance
- ✅ **Data Persistence**: Added PostgreSQL support for production, enabling data to persist across restarts
- ✅ **Attendance Sorting**: Fixed date sorting to show newest records first consistently
- ✅ **Form Experience**: Improved form reset behavior in attendance marking
- ✅ **Database Ordering**: Added database-level ordering for consistent API responses

### Performance Improvements:
- Frontend data loads only when needed (mount, add, delete)
- Optimized database queries with proper indexing
- Production database with connection pooling support

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask 3.0.0
- **ORM**: SQLAlchemy 2.0.30
- **CORS**: Flask-CORS 4.0.0
- **Database (Dev)**: SQLite3
- **Database (Prod)**: PostgreSQL 12+ (via psycopg2-binary 2.9.0)
- **Environment**: python-dotenv 1.0.0

### Frontend
- **Library**: React 18.2.0
- **HTTP Client**: Axios 1.4.0
- **Build Tool**: React Scripts 5.0.1
- **Testing**: React Test Suite

### Deployment
- **Backend Hosting**: Render.com
- **Frontend Hosting**: Vercel.com
- **Version Control**: GitHub

## ℹ️ Project Information

- **Type**: Full-stack HR Management System
- **Purpose**: Educational HRMS demonstration and practice project
- **Build Date**: March 2026
- **Current Version**: 1.4.0
- **Status**: Production Ready

## 📄 License

This project is an educational demonstration of HRMS system concepts.

## 🤝 Contributing

This is a project-based assignment. Direct contributions follow the project requirements and architectural patterns established in this codebase.

## 📞 Support

For detailed information:
- **Backend**: See [backend/README.md](backend/README.md)
- **Frontend**: See [frontend/README.md](frontend/README.md)
- **Database Setup**: See [PRODUCTION_DATABASE_SETUP.md](PRODUCTION_DATABASE_SETUP.md)

---

**Last Updated**: March 14, 2026  
**Version**: 1.4.0  
**Production Status**: Ready for Production Use
