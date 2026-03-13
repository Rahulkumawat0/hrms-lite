import React, { useState, useEffect, useCallback } from 'react';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import EmployeeList from './EmployeeList';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function EmployeeManagement({ onDataChange, refreshTrigger }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Memoize fetchEmployees to avoid infinite loops
  const fetchEmployees = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`, {
        params: {
          page: page,
          per_page: perPage
        }
      });
      if (response.data.success) {
        setEmployees(response.data.data);
        setTotalEmployees(response.data.total_count);
        setTotalPages(response.data.total_pages);
        setCurrentPage(page);
      } else {
        setError('Failed to fetch employees');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  // Fetch employees on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchEmployees(1);
  }, [refreshTrigger, fetchEmployees]);

  const handleAddEmployee = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/employees`, formData);
      if (response.data.success) {
        setSuccessMessage('Employee added successfully!');
        setShowAddForm(false);
        // Fetch first page to get updated list (more efficient than loading all)
        await fetchEmployees(1);
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

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      setSuccessMessage('Employee updated successfully!');
      setShowEditForm(false);
      setEditingEmployee(null);
      // Update the employees list with the updated employee
      const updatedEmployees = employees.map(emp =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
      setEmployees(updatedEmployees);
      onDataChange();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error updating employee');
      console.error('Error updating employee:', err);
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
        // Reload current page, or go to previous page if last item on page was deleted
        const pageToLoad = employees.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        await fetchEmployees(pageToLoad);
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

      {/* Edit Employee Form */}
      {showEditForm && editingEmployee && (
        <EditEmployee 
          employee={editingEmployee}
          onSubmit={handleUpdateEmployee}
          onCancel={() => {
            setShowEditForm(false);
            setEditingEmployee(null);
          }}
          onError={setError}
        />
      )}

      {/* Add Employee Form */}
      {showAddForm && !showEditForm && (
        <AddEmployee 
          onSubmit={handleAddEmployee}
          onCancel={() => setShowAddForm(false)}
          onError={setError}
        />
      )}

      {/* Add Employee Button */}
      {!showAddForm && !showEditForm && (
        <div className="mb-4">
          <button 
            className="btn btn-success btn-lg"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus me-2"></i>Add New Employee
          </button>
        </div>
      )}

      {/* Pagination and Filter Controls */}
      {!showAddForm && !showEditForm && employees.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="d-flex gap-2 align-items-center">
                  <label className="form-label mb-0">Show per page:</label>
                  <select 
                    className="form-select form-select-sm" 
                    style={{width: 'auto'}}
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                      fetchEmployees(1);
                    }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-muted small">
                    Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalEmployees)} of {totalEmployees}
                  </span>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-end mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => fetchEmployees(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => fetchEmployees(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => fetchEmployees(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee List */}
      <EmployeeList
        employees={employees}
        loading={loading}
        onDelete={handleDeleteEmployee}
        onEdit={handleEditEmployee}
      />
    </div>
  );
}

export default EmployeeManagement;
