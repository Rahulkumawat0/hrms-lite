import React, { useState, useCallback } from 'react';
import './styles/App.css';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceManagement from './components/AttendanceManagement';
import Analytics from './components/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container-fluid">
          <a className="navbar-brand" href="#home">
            <i className="fas fa-building"></i> HRMS Lite
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                  href="#analytics"
                  onClick={() => setActiveTab('analytics')}
                >
                  <i className="fas fa-chart-bar"></i> Analytics
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeTab === 'employees' ? 'active' : ''}`}
                  href="#employees"
                  onClick={() => setActiveTab('employees')}
                >
                  <i className="fas fa-users"></i> Employees
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                  href="#attendance"
                  onClick={() => setActiveTab('attendance')}
                >
                  <i className="fas fa-calendar-check"></i> Attendance
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="container-lg py-5">
          {activeTab === 'analytics' && (
            <Analytics />
          )}

          {activeTab === 'employees' && (
            <EmployeeManagement onDataChange={handleDataChange} refreshTrigger={refreshTrigger} />
          )}
          
          {activeTab === 'attendance' && (
            <AttendanceManagement onDataChange={handleDataChange} refreshTrigger={refreshTrigger} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <p>&copy; 2026 HRMS Lite. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p>Human Resource Management System</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
