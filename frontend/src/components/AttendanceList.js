import React from 'react';

function AttendanceList({ records, loading, employees, selectedEmployee }) {
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.full_name : 'Unknown';
  };

  const getEmployeeId = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.employee_id : 'N/A';
  };

  const getStatusBadge = (status) => {
    if (status === 'Present') {
      return <span className="badge badge-success"><i className="fas fa-check-circle me-1"></i>Present</span>;
    } else {
      return <span className="badge badge-danger"><i className="fas fa-times-circle me-1"></i>Absent</span>;
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="mt-3">Loading attendance records...</p>
          </div>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h5 className="empty-state-title">No Attendance Records</h5>
            <p className="empty-state-text">
              {selectedEmployee
                ? `No attendance records found for ${selectedEmployee.full_name}.`
                : 'Start marking attendance for employees.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sort records by date (newest first)
  const sortedRecords = [...records].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  return (
    <div className="card">
      <div className="card-header">
        <h5>
          <i className="fas fa-history me-2"></i>Attendance Records
          <span className="badge bg-light text-dark ms-2">{records.length}</span>
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Date</th>
                {!selectedEmployee && <th>Employee</th>}
                {!selectedEmployee && <th>Employee ID</th>}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <strong>
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </strong>
                  </td>
                  {!selectedEmployee && (
                    <>
                      <td>{getEmployeeName(record.employee_id)}</td>
                      <td>{getEmployeeId(record.employee_id)}</td>
                    </>
                  )}
                  <td>{getStatusBadge(record.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceList;
