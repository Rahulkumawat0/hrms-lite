import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [departmentAnalytics, setDepartmentAnalytics] = useState(null);
  const [employeeAnalytics, setEmployeeAnalytics] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'department', 'employee'

  useEffect(() => {
    fetchAnalytics();
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch summary
      const summaryRes = await axios.get(`${API_BASE_URL}/analytics/summary`);
      if (summaryRes.data.success) {
        setSummary(summaryRes.data.data);
      }

      // Fetch attendance trend
      const trendRes = await axios.get(`${API_BASE_URL}/analytics/attendance-trend`);
      if (trendRes.data.success) {
        setAttendanceTrend(trendRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments`);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

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

  const handleDepartmentChange = async (e) => {
    const dept = e.target.value;
    setSelectedDepartment(dept);
    setSelectedEmployee('');
    setEmployeeAnalytics(null);

    if (dept) {
      setLoadingDetails(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/analytics/department/${dept}`);
        if (response.data.success) {
          setDepartmentAnalytics(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching department analytics:', err);
      } finally {
        setLoadingDetails(false);
      }
    } else {
      setDepartmentAnalytics(null);
    }
  };

  const handleEmployeeChange = async (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);

    if (empId) {
      setLoadingDetails(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/analytics/employee-attendance/${empId}`);
        if (response.data.success) {
          setEmployeeAnalytics(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching employee analytics:', err);
      } finally {
        setLoadingDetails(false);
      }
    } else {
      setEmployeeAnalytics(null);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="mt-3">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>{error}
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <h2 className="section-title mb-4">
        <i className="fas fa-chart-bar me-2"></i>Analytics Dashboard
      </h2>

      {/* Tab Navigation */}
      <div className="card mb-4">
        <div className="card-body">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                type="button"
              >
                <i className="fas fa-overview me-2"></i>Overview
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'department' ? 'active' : ''}`}
                onClick={() => setActiveTab('department')}
                type="button"
              >
                <i className="fas fa-building me-2"></i>Department Analytics
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'employee' ? 'active' : ''}`}
                onClick={() => setActiveTab('employee')}
                type="button"
              >
                <i className="fas fa-user me-2"></i>Employee Analytics
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="row mb-4">
            {/* Total Employees Card */}
            <div className="col-md-3 mb-3">
              <div className="analytics-card card-primary">
                <div className="analytics-card-header">
                  <i className="fas fa-users"></i>
                  <h6>Total Employees</h6>
                </div>
                <div className="analytics-card-value">
                  {summary?.total_employees || 0}
                </div>
                <div className="analytics-card-footer">
                  <small>Active in system</small>
                </div>
              </div>
            </div>

            {/* Attendance Records Card */}
            <div className="col-md-3 mb-3">
              <div className="analytics-card card-info">
                <div className="analytics-card-header">
                  <i className="fas fa-calendar-check"></i>
                  <h6>Total Records</h6>
                </div>
                <div className="analytics-card-value">
                  {summary?.total_attendance_records || 0}
                </div>
                <div className="analytics-card-footer">
                  <small>Attendance records</small>
                </div>
              </div>
            </div>

            {/* Present Count Card */}
            <div className="col-md-3 mb-3">
              <div className="analytics-card card-success">
                <div className="analytics-card-header">
                  <i className="fas fa-check-circle"></i>
                  <h6>Present</h6>
                </div>
                <div className="analytics-card-value">
                  {summary?.present_count || 0}
                </div>
                <div className="analytics-card-footer">
                  <small>Employees marked present</small>
                </div>
              </div>
            </div>

            {/* Absent Count Card */}
            <div className="col-md-3 mb-3">
              <div className="analytics-card card-danger">
                <div className="analytics-card-header">
                  <i className="fas fa-times-circle"></i>
                  <h6>Absent</h6>
                </div>
                <div className="analytics-card-value">
                  {summary?.absent_count || 0}
                </div>
                <div className="analytics-card-footer">
                  <small>Employees marked absent</small>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="row mb-4">
            {/* Attendance Rate */}
            <div className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="fas fa-percentage me-2"></i>Attendance Rate
                  </h6>
                  <div className="progress" style={{ height: '25px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${summary?.attendance_rate || 0}%` }}
                      aria-valuenow={summary?.attendance_rate || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {summary?.attendance_rate || 0}%
                    </div>
                  </div>
                  <small className="text-muted mt-2 d-block">
                    Overall attendance percentage
                  </small>
                </div>
              </div>
            </div>

            {/* Recent Attendance */}
            <div className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="fas fa-calendar me-2"></i>Last 7 Days
                  </h6>
                  <div className="metric-value">
                    {summary?.recent_attendance_7days || 0}
                  </div>
                  <small className="text-muted d-block">
                    Attendance records in last 7 days
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Departments Distribution */}
          {summary?.departments && Object.keys(summary.departments).length > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5>
                      <i className="fas fa-building me-2"></i>Employees by Department
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {Object.entries(summary.departments).map(([dept, count], idx) => (
                        <div key={idx} className="col-md-4 col-lg-3 mb-3">
                          <div className="department-card">
                            <div className="dept-name">{dept}</div>
                            <div className="dept-count">{count}</div>
                            <div className="dept-percentage">
                              {((count / summary.total_employees) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Trend Chart */}
          {attendanceTrend && attendanceTrend.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5>
                      <i className="fas fa-chart-line me-2"></i>Attendance Trend (Last 30 Days)
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th className="text-success">Present</th>
                            <th className="text-danger">Absent</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceTrend.map((record, idx) => (
                            <tr key={idx}>
                              <td>
                                <small>{new Date(record.date).toLocaleDateString()}</small>
                              </td>
                              <td>
                                <span className="badge bg-success">{record.Present || 0}</span>
                              </td>
                              <td>
                                <span className="badge bg-danger">{record.Absent || 0}</span>
                              </td>
                              <td>
                                <small className="fw-bold">
                                  {(record.Present || 0) + (record.Absent || 0)}
                                </small>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!summary && !loading && (
            <div className="card">
              <div className="card-body text-center">
                <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                <p className="mt-3 text-muted">No analytics data available yet.</p>
                <small>Add employees and mark attendance to see analytics.</small>
              </div>
            </div>
          )}
        </>
      )}

      {/* Department Analytics Tab */}
      {activeTab === 'department' && (
        <>
          {/* Department Filter */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="departmentSelect" className="form-label">
                    <i className="fas fa-building me-2"></i>Select Department
                  </label>
                  <select
                    id="departmentSelect"
                    className="form-select"
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                  >
                    <option value="">-- Choose a Department --</option>
                    {departments.map((dept) => (
                      <option key={dept.name} value={dept.name}>
                        {dept.name} ({dept.count} employees)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Department Analytics Display */}
          {loadingDetails ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : departmentAnalytics ? (
            <>
              {/* Department Summary Cards */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="analytics-card card-primary">
                    <div className="analytics-card-header">
                      <i className="fas fa-users"></i>
                      <h6>Total Employees</h6>
                    </div>
                    <div className="analytics-card-value">
                      {departmentAnalytics?.total_employees || 0}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="analytics-card card-info">
                    <div className="analytics-card-header">
                      <i className="fas fa-calendar-check"></i>
                      <h6>Total Records</h6>
                    </div>
                    <div className="analytics-card-value">
                      {departmentAnalytics?.total_records || 0}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="analytics-card card-success">
                    <div className="analytics-card-header">
                      <i className="fas fa-check-circle"></i>
                      <h6>Present</h6>
                    </div>
                    <div className="analytics-card-value">
                      {departmentAnalytics?.present_count || 0}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="analytics-card card-danger">
                    <div className="analytics-card-header">
                      <i className="fas fa-times-circle"></i>
                      <h6>Absent</h6>
                    </div>
                    <div className="analytics-card-value">
                      {departmentAnalytics?.absent_count || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Attendance Rate */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">
                        <i className="fas fa-percentage me-2"></i>Department Attendance Rate
                      </h6>
                      <div className="progress" style={{ height: '25px' }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${departmentAnalytics?.attendance_rate || 0}%` }}
                          aria-valuenow={departmentAnalytics?.attendance_rate || 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {departmentAnalytics?.attendance_rate || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Breakdown */}
              {departmentAnalytics?.employees && departmentAnalytics.employees.length > 0 && (
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h5>
                          <i className="fas fa-list me-2"></i>Employee Breakdown
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Employee Name</th>
                                <th>Email</th>
                                <th>Total Records</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Attendance Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {departmentAnalytics.employees.map((emp, idx) => (
                                <tr key={idx}>
                                  <td><strong>{emp.employee?.full_name}</strong></td>
                                  <td>{emp.employee?.email}</td>
                                  <td>{emp.total_records}</td>
                                  <td><span className="badge bg-success">{emp.present_count}</span></td>
                                  <td><span className="badge bg-danger">{emp.absent_count}</span></td>
                                  <td>{emp.attendance_rate}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card">
              <div className="card-body text-center text-muted">
                <p>Select a department to view analytics</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Employee Analytics Tab */}
      {activeTab === 'employee' && (
        <>
          {/* Employee Filter */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="employeeSelect" className="form-label">
                    <i className="fas fa-user me-2"></i>Select Employee
                  </label>
                  <select
                    id="employeeSelect"
                    className="form-select"
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                  >
                    <option value="">-- Choose an Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Analytics Display */}
          {loadingDetails ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : employeeAnalytics ? (
            <>
              {/* Employee Info Card */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{employeeAnalytics?.employee?.full_name}</h5>
                      <p className="card-text">
                        <strong>Employee ID:</strong> {employeeAnalytics?.employee?.employee_id} | 
                        <strong className="ms-3">Department:</strong> {employeeAnalytics?.employee?.department} | 
                        <strong className="ms-3">Email:</strong> {employeeAnalytics?.employee?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Summary Cards */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="analytics-card card-info">
                    <div className="analytics-card-header">
                      <i className="fas fa-calendar-check"></i>
                      <h6>Total Records</h6>
                    </div>
                    <div className="analytics-card-value">
                      {employeeAnalytics?.total_records || 0}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="analytics-card card-success">
                    <div className="analytics-card-header">
                      <i className="fas fa-check-circle"></i>
                      <h6>Present</h6>
                    </div>
                    <div className="analytics-card-value">
                      {employeeAnalytics?.present_count || 0}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="analytics-card card-danger">
                    <div className="analytics-card-header">
                      <i className="fas fa-times-circle"></i>
                      <h6>Absent</h6>
                    </div>
                    <div className="analytics-card-value">
                      {employeeAnalytics?.absent_count || 0}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="analytics-card card-warning">
                    <div className="analytics-card-header">
                      <i className="fas fa-percentage"></i>
                      <h6>Attendance Rate</h6>
                    </div>
                    <div className="analytics-card-value">
                      {employeeAnalytics?.attendance_rate || 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Attendance Progress */}
              <div className="row mb-4">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">
                        <i className="fas fa-percentage me-2"></i>Attendance Progress
                      </h6>
                      <div className="progress" style={{ height: '30px' }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${employeeAnalytics?.attendance_rate || 0}%` }}
                          aria-valuenow={employeeAnalytics?.attendance_rate || 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {employeeAnalytics?.attendance_rate || 0}%
                        </div>
                      </div>
                      <small className="text-muted mt-2 d-block">
                        Overall attendance percentage
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">
                        <i className="fas fa-calendar me-2"></i>Last 30 Days
                      </h6>
                      <div className="metric-value">
                        {employeeAnalytics?.last_30_days_records || 0}
                      </div>
                      <small className="text-muted d-block">
                        Records in last 30 days
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card">
              <div className="card-body text-center text-muted">
                <p>Select an employee to view their attendance analytics</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Refresh Button */}
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            fetchAnalytics();
            fetchDepartments();
            fetchEmployees();
          }}
          disabled={loading}
        >
          <i className="fas fa-sync me-2"></i>
          {loading ? 'Refreshing...' : 'Refresh All'}
        </button>
      </div>
    </div>
  );
}

export default Analytics;
