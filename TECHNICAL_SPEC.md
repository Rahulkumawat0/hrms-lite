# HRMS Lite - Technical Specification

## System Overview

HRMS Lite is a full-stack web application for managing employee records and attendance tracking. Built with Python Flask backend and React frontend, it provides a modern, responsive interface for HR operations.

---

## Architecture

### Layers

```
┌─────────────────────────────────────┐
│   Frontend (React)                   │
│   http://localhost:3000              │
│   - Components                       │
│   - State Management                 │
│   - API Integration                  │
└────────────┬────────────────────────┘
             │ HTTP REST API
             │ (Axios)
┌────────────▼────────────────────────┐
│   Backend (Flask)                    │
│   http://localhost:5000              │
│   - Route Handlers                   │
│   - Business Logic                   │
│   - API Endpoints                    │
└────────────┬────────────────────────┘
             │ SQL / ORM
┌────────────▼────────────────────────┐
│   Database (SQLite)                  │
│   hrms.db                            │
│   - Employees Table                  │
│   - Attendance Table                 │
└─────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.2.0 |
| **HTTP Client** | Axios | 1.4.0 |
| **CSS Framework** | Bootstrap | 5.3.0 (CDN) |
| **Icons** | Font Awesome | 6.4.0 (CDN) |
| **Backend Framework** | Flask | 3.0.0 |
| **ORM** | SQLAlchemy | 2.0.30+ |
| **Flask Extension** | Flask-SQLAlchemy | 3.1.0+ |
| **CORS** | Flask-CORS | 4.0.0+ |
| **Database** | SQLite 3 | Default |
| **Runtime** | Python | 3.8+ |
| **Node** | Node.js | 14+ |

---

## Database Schema

### Tables

#### employees
```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employee_id ON employees(employee_id);
CREATE INDEX idx_email ON employees(email);
```

**Fields**:
- `id`: Auto-increment primary key
- `employee_id`: Unique identifier for employee (EMP001, etc.)
- `full_name`: Employee's full name
- `email`: Unique email address
- `department`: Department of employee
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

**Constraints**:
- Employee ID must be unique
- Email must be unique
- All fields are NOT NULL

#### attendance
```sql
CREATE TABLE attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER FOREIGN KEY REFERENCES employees(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_employee_date 
    ON attendance(employee_id, date);
CREATE INDEX idx_employee_id ON attendance(employee_id);
```

**Fields**:
- `id`: Auto-increment primary key
- `employee_id`: Foreign key to employees table
- `date`: Date of attendance (YYYY-MM-DD)
- `status`: Presence status (Present/Absent)
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

**Constraints**:
- Composite unique on (employee_id, date) - prevents duplicate entries
- Foreign key ensures referential integrity
- Status limited to valid values

**Relationship**:
- One Employee can have many Attendance records (1:N)
- Deleting an employee cascades delete to attendance records

---

## API Specification

### Base URL
```
http://localhost:5000/api
```

### Response Format

**Success Response** (200, 201):
```json
{
  "success": true,
  "message": "Operation description",
  "data": {...}
}
```

**Error Response** (400, 404, 500):
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Error 1", "Error 2"]
}
```

### Endpoints

#### 1. Health Check
```
GET /health
Response: 200 OK
{
  "success": true,
  "message": "HRMS API is running"
}
```

#### 2. Employee Endpoints

**Get All Employees**
```
GET /employees
Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_id": "EMP001",
      "full_name": "John Doe",
      "email": "john@example.com",
      "department": "Engineering",
      "created_at": "2026-03-07T09:00:00",
      "updated_at": "2026-03-07T09:00:00"
    }
  ],
  "count": 1
}
```

**Create Employee**
```
POST /employees
Content-Type: application/json

Request:
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}

Response: 201 Created
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "employee_id": "EMP001",
    ...
  }
}
```

**Validation Errors** (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Employee ID already exists",
    "Invalid email format"
  ]
}
```

**Get Specific Employee**
```
GET /employees/{id}
Response: 200 OK or 404 Not Found
```

**Delete Employee**
```
DELETE /employees/{id}
Response: 200 OK
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

#### 3. Attendance Endpoints

**Get All Attendance**
```
GET /attendance
Query Parameters:
  - employee_id (optional): Filter by employee

Response: 200 OK
{
  "success": true,
  "data": [...],
  "count": 10
}
```

**Mark Attendance**
```
POST /attendance
Content-Type: application/json

Request:
{
  "employee_id": 1,
  "date": "2026-03-07",
  "status": "Present"
}

Response: 201 Created (or 200 Updated if duplicate)
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "id": 1,
    "employee_id": 1,
    "date": "2026-03-07",
    "status": "Present",
    ...
  }
}
```

**Get Employee Attendance**
```
GET /employees/{id}/attendance
Response: 200 OK
{
  "success": true,
  "data": {
    "employee": {...},
    "attendance_records": [...],
    "count": 5
  }
}
```

---

## Input Validation

### Employee Validation

| Field | Rules | Example |
|-------|-------|---------|
| employee_id | Required, unique, non-empty string | "EMP001" |
| full_name | Required, non-empty string | "John Doe" |
| email | Required, valid email format, unique | "john@example.com" |
| department | Required, valid department | "Engineering" |

**Valid Departments**:
- Engineering
- Sales
- Marketing
- HR
- Finance
- Operations
- Support
- Other

### Attendance Validation

| Field | Rules | Example |
|-------|-------|---------|
| employee_id | Required, must exist in database | 1 |
| date | Required, YYYY-MM-DD format | "2026-03-07" |
| status | Required, "Present" or "Absent" | "Present" |

---

## Error Codes

| Code | Status | Meaning | Resolution |
|------|--------|---------|-----------|
| 200 | OK | Successful GET/DELETE | N/A |
| 201 | Created | Successful POST | N/A |
| 400 | Bad Request | Validation failed | Fix input data |
| 404 | Not Found | Resource not found | Check ID exists |
| 405 | Method Not Allowed | Wrong HTTP method | Use correct method |
| 500 | Server Error | Internal server error | Check server logs |

---

## Component Hierarchy

### Frontend Components

```
App.js (Root)
├── Navigation
├── MainContent
│   ├── EmployeeManagement (if tab === 'employees')
│   │   ├── AddEmployee
│   │   └── EmployeeList
│   └── AttendanceManagement (if tab === 'attendance')
│       ├── AttendanceForm
│       └── AttendanceList
└── Footer
```

### Component Props

**EmployeeManagement**
```javascript
props: {
  onDataChange: Function,
  refreshTrigger: Number
}
```

**AttendanceManagement**
```javascript
props: {
  onDataChange: Function,
  refreshTrigger: Number
}
```

---

## State Management

### Component-Level State

Uses React useState hooks for:
- Form data
- API responses
- Loading states
- Error messages
- Success messages
- UI visibility

### Data Flow

```
User Interaction
    ↓
Event Handler (onClick, onChange, onSubmit)
    ↓
API Call (Axios)
    ↓
Backend Processing
    ↓
Database Operation
    ↓
Response
    ↓
State Update
    ↓
Component Re-render
    ↓
UI Update
```

---

## HTTP Methods & Status Codes

| Method | Purpose | Status Code |
|--------|---------|------------|
| GET | Retrieve data | 200 |
| POST | Create data | 201 |
| PUT | Update all fields | 200 |
| PATCH | Update some fields | 200 |
| DELETE | Remove data | 200 |

---

## Security Considerations

### Implemented
- ✅ Input validation on both client & server
- ✅ CORS protection
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ XSS protection (React auto-escapes)
- ✅ HTTPS in production (via Render/Vercel)

### Not Implemented (Out of Scope)
- Authentication/Authorization
- API key validation
- Rate limiting
- Database encryption
- Audit logging

---

## Performance Considerations

### Optimization Strategies

1. **Frontend**:
   - React component memoization
   - Lazy loading imports
   - Efficient list rendering
   - Minimal re-renders

2. **Backend**:
   - Database indexing on frequently queried fields
   - Connection pooling
   - Query optimization
   - Proper error handling

3. **Database**:
   - Indexes on employee_id, email, employee_id in attendance
   - Composite index on (employee_id, date)
   - Foreign key relationships

### Expected Performance

- Page load time: < 2 seconds
- API response time: < 200ms
- Form submission: < 500ms
- Database queries: < 50ms

---

## Deployment Considerations

### Development
- SQLite database
- Debug mode enabled
- CORS allows localhost
- Hot module reloading

### Production
- SQLite or PostgreSQL
- Debug mode disabled
- CORS restricted to frontend URL
- Automatic HTTPS
- Health checks
- Monitoring & logs

---

## Testing Scenarios

### Employee Management
1. ✅ Add valid employee
2. ✅ Prevent duplicate employee ID
3. ✅ Prevent invalid email
4. ✅ View employee list
5. ✅ Delete employee
6. ✅ Handle connection errors

### Attendance Management
1. ✅ Mark attendance for employee
2. ✅ Update existing attendance
3. ✅ View attendance records
4. ✅ Filter by employee
5. ✅ Validate date format
6. ✅ Handle invalid status

---

## Scaling Plan

### Phase 1 (Current)
- Single Flask instance
- SQLite database
- Vercel frontend

### Phase 2 (Growth)
- PostgreSQL database
- Render paid plan
- Caching layer (Redis)

### Phase 3 (Enterprise)
- Load balancing
- Database replication
- Microservices
- Advanced monitoring

---

## Code Quality Metrics

- **Backend Lines of Code**: ~500
- **Frontend Lines of Code**: ~1200
- **CSS Lines**: ~800
- **Documentation**: ~2000 lines
- **Test Coverage**: Ready for unit tests

---

## File Size Summary

| Component | Size | Files |
|-----------|------|-------|
| Backend | ~15 KB | 5 files |
| Frontend | ~45 KB | 10 files |
| Documentation | ~50 KB | 7 files |
| **Total** | **~110 KB** | **~22 files** |

---

## Future Enhancements

Potential features for v2.0:
- [ ] User authentication & authorization
- [ ] Role-based access control (Admin, HR, Employee)
- [ ] Leave management
- [ ] Payroll integration
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] Mobile app
- [ ] Dark mode
- [ ] Multi-language support
- [ ] API documentation (Swagger)

---

**Technical Specification Version**: 1.0  
**Last Updated**: March 7, 2026  
**Status**: Complete & Production Ready
