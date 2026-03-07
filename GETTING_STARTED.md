# HRMS Lite - Quick Start Guide

## 🌐 Try the Live Application

The application is already deployed and live in production:

**Frontend**: [https://hrms-lite-nine-sage.vercel.app/](https://hrms-lite-nine-sage.vercel.app/) - Ready to use immediately!

**Backend API**: [https://hrms-lite-qan7.onrender.com/api](https://hrms-lite-qan7.onrender.com/api) - Test the API endpoints

---

## 🚀 Run Locally (5 minutes)

Want to run the application on your machine? Follow these steps:

### Prerequisites

- Python 3.8+
- Node.js 14+
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/Rahulkumawat0/hrms-lite.git
cd hrms-lite
```

### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

**Backend running at**: http://localhost:5000

### Step 3: Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend running at**: http://localhost:3000

## ✅ Verify Installation

### Test Backend API

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"success": true, "message": "HRMS API is running"}
```

### Test Frontend

Open browser and visit: http://localhost:3000

You should see the HRMS Lite application with:
- Navigation bar with Employees and Attendance tabs
- Professional gradient background
- Ready-to-use interface

## 📚 Key Features

### Employee Management
1. Click "Add New Employee" button
2. Fill in employee details:
   - Employee ID (e.g., EMP001)
   - Full Name
   - Email
   - Department
3. Click "Save Employee"
4. View all employees in the table
5. Delete employees with delete button

### Attendance Management
1. Go to "Attendance" tab
2. Select an employee
3. Choose date
4. Choose status (Present/Absent)
5. Click "Record Attendance"
6. View all attendance records

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:
```
FLASK_ENV=development
FLASK_APP=app.py
```

### Frontend Configuration

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📂 Project Structure

```
hrms-lite/
├── backend/
│   ├── app.py              # Flask application
│   ├── models.py           # Database models
│   ├── config.py           # Configuration
│   └── requirements.txt     # Dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── styles/         # CSS styles
│   │   ├── App.js          # Main app
│   │   └── index.js        # Entry point
│   └── package.json        # NPM dependencies
└── README.md               # Main documentation
```

## 🛠️ Available Commands

### Backend Commands

```bash
# Start development server
python app.py

# Run with specific port
python -c "from app import create_app; app = create_app(); app.run(port=8000)"
```

### Frontend Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change port in app.py
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)  # Use 8000 instead
```

**Database errors:**
```bash
# Delete and recreate database
rm hrms.db
python app.py
```

### Frontend Issues

**Port 3000 already in use:**
```bash
PORT=3001 npm start
```

**API connection errors:**
- Check backend is running at http://localhost:5000
- Verify `REACT_APP_API_URL` in `.env` file
- Check browser console for CORS errors

## 🚀 Next Steps

1. **Customize**: Modify colors, departments, or add features
2. **Test**: Add more employees and attendance records
3. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
4. **Secure**: Add authentication and validation as needed

## 📞 Support

- Check [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Check backend logs: `backend` terminal
- Check frontend logs: `frontend` terminal

## 🎓 Learning Resources

- **Flask**: https://flask.palletsprojects.com/
- **React**: https://react.dev/
- **Bootstrap**: https://getbootstrap.com/
- **SQLAlchemy**: https://www.sqlalchemy.org/

---

**Happy coding!** 🎉

For issues or questions, please refer to the detailed documentation in README.md and DEPLOYMENT.md files.
