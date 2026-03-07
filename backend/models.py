from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import re

db = SQLAlchemy()

class Employee(db.Model):
    """Employee model"""
    __tablename__ = 'employees'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    department = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    attendance_records = db.relationship('Attendance', backref='employee', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert employee to dictionary"""
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'full_name': self.full_name,
            'email': self.email,
            'department': self.department,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @staticmethod
    def validate(data):
        """Validate employee data"""
        errors = []
        
        if not data.get('employee_id'):
            errors.append('Employee ID is required')
        elif not isinstance(data.get('employee_id'), str):
            errors.append('Employee ID must be a string')
        elif len(data.get('employee_id', '').strip()) == 0:
            errors.append('Employee ID cannot be empty')
            
        if not data.get('full_name'):
            errors.append('Full name is required')
        elif not isinstance(data.get('full_name'), str):
            errors.append('Full name must be a string')
        elif len(data.get('full_name', '').strip()) == 0:
            errors.append('Full name cannot be empty')
            
        if not data.get('email'):
            errors.append('Email address is required')
        elif not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', data.get('email', '')):
            errors.append('Invalid email format')
            
        if not data.get('department'):
            errors.append('Department is required')
        elif not isinstance(data.get('department'), str):
            errors.append('Department must be a string')
        elif len(data.get('department', '').strip()) == 0:
            errors.append('Department cannot be empty')
            
        return errors


class Attendance(db.Model):
    """Attendance model"""
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # Present, Absent
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('employee_id', 'date', name='unique_employee_date'),
    )
    
    def to_dict(self):
        """Convert attendance to dictionary"""
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'date': self.date.isoformat() if self.date else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @staticmethod
    def validate(data):
        """Validate attendance data"""
        errors = []
        
        if not data.get('employee_id'):
            errors.append('Employee ID is required')
        elif not isinstance(data.get('employee_id'), int):
            errors.append('Employee ID must be an integer')
            
        if not data.get('date'):
            errors.append('Date is required')
        elif not isinstance(data.get('date'), str):
            errors.append('Date must be a string')
        else:
            try:
                from datetime import datetime
                datetime.strptime(data.get('date'), '%Y-%m-%d')
            except ValueError:
                errors.append('Invalid date format. Use YYYY-MM-DD')
                
        if not data.get('status'):
            errors.append('Status is required')
        elif data.get('status') not in ['Present', 'Absent']:
            errors.append('Status must be either "Present" or "Absent"')
            
        return errors
