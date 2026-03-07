import React, { useState, useEffect } from 'react';
import AddEmployee from './AddEmployee';
import EmployeeList from './EmployeeList';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function EmployeeManagement({ onDataChange, refreshTrigger }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [refreshTrigger]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`);
      if (response.data.success) {
        setEmployees(response.data.data);
      } else {
        setError('Failed to fetch employees');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/employees`, formData);
      if (response.data.success) {
        setSuccessMessage('Employee added successfully!');
        setShowAddForm(false);
        fetchEmployees();
        onDataChange();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to add employee');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0] || err.response?.data?.message || 'Error adding employee';
      setError(errorMsg);
      console.error('Error adding employee:', err);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/employees/${employeeId}`);
      if (response.data.success) {
        setSuccessMessage('Employee deleted successfully!');
        fetchEmployees();
        onDataChange();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to delete employee');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting employee');
      console.error('Error deleting employee:', err);
    }
  };

  return (
    <div className="employee-management">
      <h2 className="section-title mb-4">
        <i className="fas fa-users me-2"></i>Employee Management
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

      {/* Add Employee Form */}
      {showAddForm && (
        <AddEmployee 
          onSubmit={handleAddEmployee}
          onCancel={() => setShowAddForm(false)}
          onError={setError}
        />
      )}

      {/* Add Employee Button */}
      {!showAddForm && (
        <div className="mb-4">
          <button 
            className="btn btn-success btn-lg"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus me-2"></i>Add New Employee
          </button>
        </div>
      )}

      {/* Employee List */}
      <EmployeeList
        employees={employees}
        loading={loading}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
}

export default EmployeeManagement;
