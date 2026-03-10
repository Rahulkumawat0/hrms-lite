import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function EditEmployee({ employee, onSubmit, onCancel, onError }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (employee) {
      setFormData({
        full_name: employee.full_name || '',
        email: employee.email || '',
        department: employee.department || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    setValidationErrors(prev => prev.filter(err => !err.includes(name)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors([]);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/employees/${employee.id}`,
        formData
      );

      if (response.data.success) {
        onSubmit(response.data.data);
      } else {
        if (response.data.errors && Array.isArray(response.data.errors)) {
          setValidationErrors(response.data.errors);
          onError(response.data.errors[0]);
        } else {
          onError(response.data.message || 'Failed to update employee');
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0] || err.response?.data?.message || 'Error updating employee';
      setValidationErrors(Array.isArray(err.response?.data?.errors) ? err.response?.data?.errors : [errorMsg]);
      onError(errorMsg);
      console.error('Error updating employee:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 card-form">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="fas fa-edit me-2"></i>Edit Employee
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="full_name" className="form-label">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter employee full name"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter email address"
            />
          </div>

          {/* Department */}
          <div className="mb-3">
            <label htmlFor="department" className="form-label">
              Department <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter department name"
            />
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Please fix the following errors:</strong>
              <ul className="mb-0 mt-2">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Buttons */}
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>Update Employee
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              <i className="fas fa-times me-2"></i>Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployee;
