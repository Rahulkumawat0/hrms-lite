import os

class Config:
    """Base configuration"""
    SQLALCHEMY_DATABASE_URI = 'sqlite:///hrms.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'hrms-secret-key-2026'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig
    return DevelopmentConfig
