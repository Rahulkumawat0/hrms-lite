#!/usr/bin/env python
"""
Seed script to populate the database with dummy data
Run this after the app is deployed: python seed_data.py
"""

from app import create_app
from models import db, Employee, Attendance
from datetime import datetime, timedelta
import random

def seed_data():
    """Seed the database with dummy employees and attendance records"""
    app = create_app()
    
    with app.app_context():
        # Clear existing data (optional - comment out if you want to keep existing data)
        # Attendance.query.delete()
        # Employee.query.delete()
        
        # Create dummy employees
        employees_data = [
            {
                'employee_id': 'EMP001',
                'full_name': 'John Smith',
                'email': 'john.smith@company.com',
                'department': 'Engineering'
            },
            {
                'employee_id': 'EMP002',
                'full_name': 'Sarah Johnson',
                'email': 'sarah.johnson@company.com',
                'department': 'Human Resources'
            },
            {
                'employee_id': 'EMP003',
                'full_name': 'Michael Brown',
                'email': 'michael.brown@company.com',
                'department': 'Sales'
            },
            {
                'employee_id': 'EMP004',
                'full_name': 'Emily Davis',
                'email': 'emily.davis@company.com',
                'department': 'Marketing'
            },
            {
                'employee_id': 'EMP005',
                'full_name': 'David Wilson',
                'email': 'david.wilson@company.com',
                'department': 'Finance'
            },
            {
                'employee_id': 'EMP006',
                'full_name': 'Jessica Martinez',
                'email': 'jessica.martinez@company.com',
                'department': 'Engineering'
            },
            {
                'employee_id': 'EMP007',
                'full_name': 'Robert Taylor',
                'email': 'robert.taylor@company.com',
                'department': 'Operations'
            },
            {
                'employee_id': 'EMP008',
                'full_name': 'Amanda White',
                'email': 'amanda.white@company.com',
                'department': 'Customer Support'
            }
        ]
        
        # Add employees to database
        employees = []
        for emp_data in employees_data:
            # Check if employee already exists
            existing = Employee.query.filter_by(employee_id=emp_data['employee_id']).first()
            if not existing:
                employee = Employee(
                    employee_id=emp_data['employee_id'],
                    full_name=emp_data['full_name'],
                    email=emp_data['email'],
                    department=emp_data['department']
                )
                db.session.add(employee)
                employees.append(employee)
                print(f"✓ Added employee: {emp_data['full_name']}")
            else:
                employees.append(existing)
                print(f"- Employee already exists: {emp_data['full_name']}")
        
        db.session.commit()
        
        # Create dummy attendance records for the last 30 days
        print("\n--- Adding Attendance Records ---")
        today = datetime.now().date()
        statuses = ['Present', 'Absent']
        
        for employee in employees:
            # Add attendance for the last 20 working days (roughly 1 month)
            for i in range(1, 21):
                attendance_date = today - timedelta(days=i)
                
                # Skip weekends (Saturday=5, Sunday=6)
                if attendance_date.weekday() >= 5:
                    continue
                
                # Check if attendance already exists
                existing_attendance = Attendance.query.filter_by(
                    employee_id=employee.id,
                    date=attendance_date
                ).first()
                
                if not existing_attendance:
                    # Randomly assign Present or Absent (80% Present, 20% Absent)
                    status = 'Present' if random.random() < 0.8 else 'Absent'
                    
                    attendance = Attendance(
                        employee_id=employee.id,
                        date=attendance_date,
                        status=status
                    )
                    db.session.add(attendance)
            
            print(f"✓ Added attendance records for: {employee.full_name}")
        
        db.session.commit()
        
        # Print summary
        total_employees = Employee.query.count()
        total_attendance = Attendance.query.count()
        
        print("\n" + "="*50)
        print("DATABASE SEEDING COMPLETED!")
        print("="*50)
        print(f"Total Employees: {total_employees}")
        print(f"Total Attendance Records: {total_attendance}")
        print("="*50)
        print("\nYou can now start the app and review the data!")

if __name__ == '__main__':
    seed_data()
