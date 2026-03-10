from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_config
from models import db, Employee, Attendance
from datetime import datetime, date

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Configuration
    app.config.from_object(get_config())
    
    # Initialize database
    db.init_app(app)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # ==================== EMPLOYEE ENDPOINTS ====================
    
    @app.route('/api/employees', methods=['GET'])
    def get_employees():
        """Get all employees"""
        try:
            employees = Employee.query.all()
            return jsonify({
                'success': True,
                'data': [emp.to_dict() for emp in employees],
                'count': len(employees)
            }), 200
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Error retrieving employees',
                'error': str(e)
            }), 500
    
    @app.route('/api/employees', methods=['POST'])
    def create_employee():
        """Create a new employee"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'No data provided'
                }), 400
            
            # Validate data
            errors = Employee.validate(data)
            if errors:
                return jsonify({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': errors
                }), 400
            
            # Check if employee_id already exists
            existing_employee_id = Employee.query.filter_by(employee_id=data.get('employee_id')).first()
            if existing_employee_id:
                return jsonify({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': ['Employee ID already exists']
                }), 400
            
            # Check if email already exists
            existing_email = Employee.query.filter_by(email=data.get('email')).first()
            if existing_email:
                return jsonify({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': ['Email already exists']
                }), 400
            
            # Create new employee
            employee = Employee(
                employee_id=data.get('employee_id').strip(),
                full_name=data.get('full_name').strip(),
                email=data.get('email').strip(),
                department=data.get('department').strip()
            )
            
            db.session.add(employee)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Employee created successfully',
                'data': employee.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Error creating employee',
                'error': str(e)
            }), 500
    
    @app.route('/api/employees/<int:emp_id>', methods=['GET'])
    def get_employee(emp_id):
        """Get a specific employee"""
        try:
            employee = Employee.query.get(emp_id)
            if not employee:
                return jsonify({
                    'success': False,
                    'message': 'Employee not found'
                }), 404
            
            return jsonify({
                'success': True,
                'data': employee.to_dict()
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Error retrieving employee',
                'error': str(e)
            }), 500
    
    @app.route('/api/employees/<int:emp_id>', methods=['DELETE'])
    def delete_employee(emp_id):
        """Delete an employee"""
        try:
            employee = Employee.query.get(emp_id)
            if not employee:
                return jsonify({
                    'success': False,
                    'message': 'Employee not found'
                }), 404
            
            db.session.delete(employee)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Employee deleted successfully'
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Error deleting employee',
                'error': str(e)
            }), 500
    
    # ==================== ATTENDANCE ENDPOINTS ====================
    
    @app.route('/api/attendance', methods=['GET'])
    def get_attendance():
        """Get attendance records (optional: filter by employee_id)"""
        try:
            employee_id = request.args.get('employee_id', type=int)
            
            if employee_id:
                # Get attendance for a specific employee
                employee = Employee.query.get(employee_id)
                if not employee:
                    return jsonify({
                        'success': False,
                        'message': 'Employee not found'
                    }), 404
                
                records = Attendance.query.filter_by(employee_id=employee_id).order_by(Attendance.date.desc()).all()
            else:
                # Get all attendance records sorted by date (newest first)
                records = Attendance.query.order_by(Attendance.date.desc()).all()
            
            return jsonify({
                'success': True,
                'data': [record.to_dict() for record in records],
                'count': len(records)
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Error retrieving attendance records',
                'error': str(e)
            }), 500
    
    @app.route('/api/attendance', methods=['POST'])
    def mark_attendance():
        """Mark attendance for an employee"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'No data provided'
                }), 400
            
            # Validate data
            errors = Attendance.validate(data)
            if errors:
                return jsonify({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': errors
                }), 400
            
            # Check if employee exists
            employee = Employee.query.get(data.get('employee_id'))
            if not employee:
                return jsonify({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': ['Employee not found']
                }), 400
            
            # Check if attendance already marked for the day
            attendance_date = datetime.strptime(data.get('date'), '%Y-%m-%d').date()
            existing_attendance = Attendance.query.filter_by(
                employee_id=data.get('employee_id'),
                date=attendance_date
            ).first()
            
            if existing_attendance:
                # Update existing attendance
                existing_attendance.status = data.get('status')
                existing_attendance.updated_at = datetime.utcnow()
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'message': 'Attendance updated successfully',
                    'data': existing_attendance.to_dict()
                }), 200
            
            # Create new attendance record
            attendance = Attendance(
                employee_id=data.get('employee_id'),
                date=attendance_date,
                status=data.get('status')
            )
            
            db.session.add(attendance)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Attendance marked successfully',
                'data': attendance.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Error marking attendance',
                'error': str(e)
            }), 500
    
    @app.route('/api/attendance/<int:attendance_id>', methods=['GET'])
    def get_attendance_record(attendance_id):
        """Get a specific attendance record"""
        try:
            record = Attendance.query.get(attendance_id)
            if not record:
                return jsonify({
                    'success': False,
                    'message': 'Attendance record not found'
                }), 404
            
            return jsonify({
                'success': True,
                'data': record.to_dict()
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Error retrieving attendance record',
                'error': str(e)
            }), 500
    
    @app.route('/api/employees/<int:emp_id>/attendance', methods=['GET'])
    def get_employee_attendance(emp_id):
        """Get attendance records for a specific employee"""
        try:
            employee = Employee.query.get(emp_id)
            if not employee:
                return jsonify({
                    'success': False,
                    'message': 'Employee not found'
                }), 404
            
            records = Attendance.query.filter_by(employee_id=emp_id).order_by(Attendance.date.desc()).all()
            return jsonify({
                'success': True,
                'data': {
                    'employee': employee.to_dict(),
                    'attendance_records': [record.to_dict() for record in records],
                    'count': len(records)
                }
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Error retrieving employee attendance',
                'error': str(e)
            }), 500
    
    # ==================== ANALYTICS ENDPOINTS ====================
    
    @app.route('/api/analytics/summary', methods=['GET'])
    def get_analytics_summary():
        """Get analytics summary with key metrics"""
        try:
            # Total employees
            total_employees = Employee.query.count()
            
            # Get employees by department
            departments_data = db.session.query(
                Employee.department,
                db.func.count(Employee.id).label('count')
            ).group_by(Employee.department).all()
            
            departments = {dept: count for dept, count in departments_data}
            
            # Attendance statistics
            total_attendance = Attendance.query.count()
            present_count = Attendance.query.filter_by(status='Present').count()
            absent_count = Attendance.query.filter_by(status='Absent').count()
            
            # Calculate attendance rate
            if total_attendance > 0:
                attendance_rate = (present_count / total_attendance) * 100
            else:
                attendance_rate = 0
            
            # Recent attendance (last 7 days)
            from datetime import datetime, timedelta
            seven_days_ago = date.today() - timedelta(days=7)
            recent_attendance = Attendance.query.filter(
                Attendance.date >= seven_days_ago
            ).count()
            
            return jsonify({
                'success': True,
                'data': {
                    'total_employees': total_employees,
                    'total_attendance_records': total_attendance,
                    'present_count': present_count,
                    'absent_count': absent_count,
                    'attendance_rate': round(attendance_rate, 2),
                    'recent_attendance_7days': recent_attendance,
                    'departments': departments
                }
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Error retrieving analytics',
                'error': str(e)
            }), 500
    
    @app.route('/api/analytics/attendance-trend', methods=['GET'])
    def get_attendance_trend():
        """Get attendance trend for the last 30 days"""
        try:
            from datetime import datetime, timedelta
            
            # Get data for last 30 days
            thirty_days_ago = date.today() - timedelta(days=30)
            
            # Group by date and status
            trend_data = db.session.query(
                Attendance.date,
                Attendance.status,
                db.func.count(Attendance.id).label('count')
            ).filter(
                Attendance.date >= thirty_days_ago
            ).group_by(Attendance.date, Attendance.status).order_by(Attendance.date).all()
            
            # Format response
            dates = {}
            for record in trend_data:
                date_str = record[0].isoformat()
                status = record[1]
                count = record[2]
                
                if date_str not in dates:
                    dates[date_str] = {'date': date_str, 'Present': 0, 'Absent': 0}
                
                dates[date_str][status] = count
            
            return jsonify({
                'success': True,
                'data': list(dates.values())
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Error retrieving attendance trend',
                'error': str(e)
            }), 500
    
    @app.route('/api/analytics/employee-attendance/<int:emp_id>', methods=['GET'])
    def get_employee_analytics(emp_id):
        """Get attendance analytics for a specific employee"""
        try:
            employee = Employee.query.get(emp_id)
            if not employee:
                return jsonify({
                    'success': False,
                    'message': 'Employee not found'
                }), 404
            
            # Get all attendance records for employee
            records = Attendance.query.filter_by(employee_id=emp_id).all()
            
            total = len(records)
            present = sum(1 for r in records if r.status == 'Present')
            absent = sum(1 for r in records if r.status == 'Absent')
            
            attendance_rate = (present / total * 100) if total > 0 else 0
            
            # Last 30 days
            from datetime import timedelta
            thirty_days_ago = date.today() - timedelta(days=30)
            recent_records = [r for r in records if r.date >= thirty_days_ago]
            
            return jsonify({
                'success': True,
                'data': {
                    'employee': employee.to_dict(),
                    'total_records': total,
                    'present_count': present,
                    'absent_count': absent,
                    'attendance_rate': round(attendance_rate, 2),
                    'last_30_days_records': len(recent_records)
                }
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Error retrieving employee analytics',
                'error': str(e)
            }), 500
    
    # ==================== HEALTH CHECK ====================
    
    @app.route('/api/health', methods=['GET'])
    def health():
        """Health check endpoint"""
        return jsonify({
            'success': True,
            'message': 'HRMS API is running'
        }), 200
    
    # ==================== ERROR HANDLERS ====================
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Endpoint not found'
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            'success': False,
            'message': 'Method not allowed'
        }), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
