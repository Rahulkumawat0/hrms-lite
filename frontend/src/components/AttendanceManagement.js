import React, { useState, useEffect } from 'react';
import AttendanceForm from './AttendanceForm';
import AttendanceList from './AttendanceList';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AttendanceManagement({ onDataChange, refreshTrigger }) {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch employees and attendance on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchEmployees();
    fetchAllAttendance();
  }, [refreshTrigger]);

  // Auto-refresh attendance data every 30 seconds to ensure database sync
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedEmployee) {
        fetchEmployeeAttendance(selectedEmployee.id);
      } else {
        fetchAllAttendance();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`);
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchAllAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/attendance`);
      if (response.data.success) {
        setAttendanceRecords(response.data.data);
      } else {
        setError('Failed to fetch attendance records');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching attendance records');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeAttendance = async (employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}/attendance`);
      if (response.data.success) {
        setAttendanceRecords(response.data.data.attendance_records);
      } else {
        setError('Failed to fetch attendance records');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching attendance records');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    if (employeeId === '') {
      setSelectedEmployee(null);
      fetchAllAttendance();
    } else {
      const selected = employees.find(emp => emp.id === parseInt(employeeId));
      setSelectedEmployee(selected);
      fetchEmployeeAttendance(employeeId);
    }
  };

  const handleMarkAttendance = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/attendance`, formData);
      if (response.data.success) {
        setSuccessMessage('Attendance marked successfully!');
        // Immediately fetch fresh data from database
        if (selectedEmployee) {
          await fetchEmployeeAttendance(selectedEmployee.id);
        } else {
          await fetchAllAttendance();
        }
        onDataChange();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to mark attendance');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0] || err.response?.data?.message || 'Error marking attendance';
      setError(errorMsg);
      console.error('Error marking attendance:', err);
    }
  };

  return (
    <div className="attendance-management">
      <h2 className="section-title mb-4">
        <i className="fas fa-calendar-check me-2"></i>Attendance Management
      </h2>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>{successMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccessMessage('')}
          ></button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>{error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {/* Attendance Form */}
      <AttendanceForm
        employees={employees}
        selectedEmployee={selectedEmployee}
        onSubmit={handleMarkAttendance}
        onEmployeeSelect={handleEmployeeSelect}
      />

      {/* Attendance List */}
      <AttendanceList
        records={attendanceRecords}
        loading={loading}
        employees={employees}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
}

export default AttendanceManagement;
