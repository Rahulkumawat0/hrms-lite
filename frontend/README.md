# HRMS Lite - Frontend (React)

A modern, responsive React frontend for the HRMS Lite (Human Resource Management System).

## 🌐 Live Application

**Production URL**: https://hrms-lite-nine-sage.vercel.app/

**Fully functional and connected to production backend API**

## Features

- **Employee Management**: Add, view, and delete employees
- **Attendance Tracking**: Mark and view attendance records
- **Modern UI**: Clean design with Bootstrap 5 and custom styling
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Seamless interaction with backend API
- **Professional Design**: Modern color scheme and intuitive navigation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

For development:
```bash
npm start
```

The application will open at `http://localhost:3000`

For production build:
```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html           # Main HTML file
├── src/
│   ├── components/
│   │   ├── EmployeeManagement.js
│   │   ├── EmployeeList.js
│   │   ├── AddEmployee.js
│   │   ├── AttendanceManagement.js
│   │   ├── AttendanceForm.js
│   │   └── AttendanceList.js
│   ├── styles/
│   │   └── App.css          # Global styles
│   ├── App.js               # Main App component
│   └── index.js             # React entry point
├── package.json             # Dependencies
└── README.md                # This file
```

## Technologies Used

- **React 18** - UI framework
- **Axios** - HTTP client for API calls
- **Bootstrap 5** - CSS framework via CDN
- **Font Awesome** - Icon library

## API Integration

The frontend communicates with the Flask backend at the URL specified in `.env`:

### Employee Endpoints
- `GET /employees` - Get all employees
- `POST /employees` - Create new employee
- `DELETE /employees/{id}` - Delete employee

### Attendance Endpoints
- `GET /attendance` - Get all attendance records
- `POST /attendance` - Mark attendance
- `GET /employees/{id}/attendance` - Get employee's attendance

## Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (below 768px)

## Environment Configuration

See `.env.example` for available configuration options.

## Troubleshooting

**API Connection Issues:**
- Ensure the backend server is running
- Check the `REACT_APP_API_URL` in `.env` matches your backend URL
- Check browser console for error messages

**Port Conflicts:**
- If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 npm start
```

## Building for Deployment

1. Build the application:
```bash
npm run build
```

2. This creates a `build/` directory with optimized production files

3. Deploy the `build/` folder to a hosting service like:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3

## License

This project is part of the HRMS Lite application.
