# HRMS Lite - Human Resource Management System

A modern, full-stack web application for managing employee records and attendance tracking.

## 📋 Overview

HRMS Lite is a comprehensive HR management solution that allows administrators to:
- **Manage Employees**: Add, view, and delete employee records
- **Track Attendance**: Mark and view employee attendance with status

Built with:
- **Backend**: Python Flask with SQLAlchemy ORM
- **Frontend**: React 18 with Bootstrap 5
- **Database**: SQLite
- **API**: RESTful API with proper validation and error handling

## 🎯 Features

### Employee Management
✅ Add new employees with unique Employee ID, email, and department  
✅ View all employees in a responsive table  
✅ Delete employees with confirmation  
✅ Email format validation  
✅ Prevent duplicate employee IDs and emails  

### Attendance Management
✅ Mark attendance for employees (Present/Absent)  
✅ View attendance records with date-based filtering  
✅ Prevent duplicate attendance entries (updates if already marked)  
✅ View attendance records by employee or all records  

### Technical Features
✅ RESTful API with proper HTTP status codes  
✅ Comprehensive error handling and validation  
✅ CORS enabled for cross-origin requests  
✅ Professional UI with modern design  
✅ Responsive design for all devices  
✅ Loading, empty, and error states  

## 📁 Project Structure

```
human-resource-management-system/
├── backend/                    # Flask API Server
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── models.py              # Database models
│   ├── requirements.txt        # Python dependencies
│   ├── .env                   # Environment variables
│   ├── .gitignore             # Git ignore rules
│   └── README.md              # Backend documentation
│
└── frontend/                  # React Frontend
    ├── public/
    │   └── index.html         # Main HTML file
    ├── src/
    │   ├── components/        # React components
    │   ├── styles/            # CSS styles
    │   ├── App.js             # Main App component
    │   └── index.js           # React entry point
    ├── package.json           # NPM dependencies
    ├── .env.example           # Example env file
    ├── .gitignore             # Git ignore rules
    └── README.md              # Frontend documentation
```

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
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

4. Start the development server:
```bash
npm start
```

Application will open at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Employee Endpoints

**Get All Employees**
```
GET /employees
```

**Create Employee**
```
POST /employees
Content-Type: application/json

{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

**Get Specific Employee**
```
GET /employees/{id}
```

**Delete Employee**
```
DELETE /employees/{id}
```

### Attendance Endpoints

**Get All Attendance Records**
```
GET /attendance
```

**Mark Attendance**
```
POST /attendance
Content-Type: application/json

{
  "employee_id": 1,
  "date": "2026-03-07",
  "status": "Present"
}
```

**Get Employee Attendance**
```
GET /employees/{id}/attendance
```

### Health Check
```
GET /api/health
```

## 🎨 Design & UI

- **Color Scheme**: Modern gradient purple (#667eea to #764ba2)
- **Typography**: Segoe UI for a professional look
- **Components**: Bootstrap 5 for responsive design
- **Icons**: Font Awesome for intuitive icons
- **States**: Loading spinners, empty states, error messages

## 🔐 Validation

### Employee Validation
- Employee ID is unique and required
- Full name is required
- Email format validation and uniqueness
- Department is required from predefined list

### Attendance Validation
- Employee ID must exist
- Date format validation (YYYY-MM-DD)
- Status must be "Present" or "Absent"
- Prevents duplicate entries (updates instead)

## 📱 Responsive Design

- **Desktop**: Optimized for 1920px and above
- **Laptop**: 1024px - 1920px
- **Tablet**: 768px - 1024px
- **Mobile**: Below 768px

## 🌐 Browser Support

- Chrome (latest)
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
  "errors": ["Error 1", "Error 2"]
}
```

## 🔄 Data Flow

1. User interacts with React frontend
2. Frontend sends API request to Flask backend
3. Flask validates data and processes request
4. Database is updated/queried as needed
5. Response is sent back to frontend
6. Frontend updates UI with response data

## 🚢 Deployment

### Backend Deployment (using Render)

1. Push code to GitHub
2. Create new Render service
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Frontend Deployment (using Vercel)

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables
4. Deploy automatically on push

## 📋 Assumptions

- Single admin user (no authentication required)
- Database resets on server restart (SQLite in-memory friendly)
- No multi-tenancy
- Basic CRUD operations only

## 🛠️ Technologies

- **Backend**: Flask 2.3.3, SQLAlchemy 2.0.21
- **Frontend**: React 18.2.0, Axios 1.4.0
- **Database**: SQLite3
- **CSS**: Bootstrap 5, Font Awesome 6
- **Version Control**: Git/GitHub

## 📄 License

This project is an educational demonstration of HRMS system.

## 🤝 Contributing

This is a project-based assignment. Direct contributions follow the project requirements.

## 📞 Support

For questions or issues, refer to the individual README files in `backend/` and `frontend/` directories.

---

**Build Date**: March 7, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
