# HRMS Lite - Backend (Flask)

A RESTful API for Human Resource Management System built with Flask.

## Features

- **Employee Management**: Add, view, and delete employees
- **Attendance Tracking**: Mark and view attendance records
- **Data Validation**: Server-side validation for all inputs
- **Error Handling**: Proper HTTP status codes and meaningful error messages
- **Database**: SQLite for data persistence

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Employee Management

- **GET** `/api/employees` - Get all employees
- **POST** `/api/employees` - Create a new employee
- **GET** `/api/employees/<id>` - Get a specific employee
- **DELETE** `/api/employees/<id>` - Delete an employee

### Attendance Management

- **GET** `/api/attendance` - Get all attendance records
- **POST** `/api/attendance` - Mark attendance
- **GET** `/api/attendance/<id>` - Get a specific attendance record
- **GET** `/api/employees/<id>/attendance` - Get attendance for a specific employee

### Health Check

- **GET** `/api/health` - Check API health status

## Request Examples

### Create Employee
```json
POST /api/employees
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

### Mark Attendance
```json
POST /api/attendance
{
  "employee_id": 1,
  "date": "2026-03-07",
  "status": "Present"
}
```

## Database

The application uses SQLite database (`hrms.db`) which is created automatically on first run.

## Environment Configuration

See `.env` file for configuration options.
