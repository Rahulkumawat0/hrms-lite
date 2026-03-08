import React, { useState, useEffect } from 'react';

function AttendanceForm({ employees, selectedEmployee, onSubmit, onEmployeeSelect }) {
  const [formData, setFormData] = useState({
    employee_id: selectedEmployee?.id || '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Update form when selectedEmployee changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      employee_id: selectedEmployee?.id || ''
    }));
  }, [selectedEmployee]);

  const validateForm = () => {
    const errors = {};

    if (!formData.employee_id) {
      errors.employee_id = 'Please select an employee';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (!formData.status) {
      errors.status = 'Status is required';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employee_id' ? (value ? parseInt(value) : '') : value
    }));
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEmployeeSelect = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      employee_id: value ? parseInt(value) : ''
    }));
    onEmployeeSelect(value);
    if (validationErrors.employee_id) {
      setValidationErrors(prev => ({
        ...prev,
        employee_id: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    setValidationErrors({});

    try {
      await onSubmit({
        employee_id: formData.employee_id,
        date: formData.date,
        status: formData.status
      });
      // Reset form but keep selected employee
      setFormData({
        employee_id: selectedEmployee?.id || '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
    } catch (err) {
      console.error('Error in form submission:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5>
          <i className="fas fa-clipboard-check me-2"></i>Mark Attendance
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="employee_id" className="form-label">
                  Employee <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${validationErrors.employee_id ? 'is-invalid' : ''}`}
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleEmployeeSelect}
                  disabled={loading}
                >
                  <option value="">Select an employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
                {validationErrors.employee_id && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {validationErrors.employee_id}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${validationErrors.date ? 'is-invalid' : ''}`}
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={loading}
                />
                {validationErrors.date && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {validationErrors.date}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${validationErrors.status ? 'is-invalid' : ''}`}
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
                {validationErrors.status && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {validationErrors.status}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group mt-4">
            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Recording...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>Record Attendance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttendanceForm;
