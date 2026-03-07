import React from 'react';

function EmployeeList({ employees, loading, onDelete }) {
  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="mt-3">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-inbox"></i>
            </div>
            <h5 className="empty-state-title">No Employees Found</h5>
            <p className="empty-state-text">
              Start by adding your first employee to the system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>
          <i className="fas fa-list me-2"></i>Employee List
          <span className="badge bg-light text-dark ms-2">{employees.length}</span>
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <strong>{employee.employee_id}</strong>
                  </td>
                  <td>{employee.full_name}</td>
                  <td>
                    <a href={`mailto:${employee.email}`}>{employee.email}</a>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {employee.department}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(employee.id)}
                      title="Delete Employee"
                    >
                      <i className="fas fa-trash-alt me-1"></i>Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
