import os
from sqlalchemy import create_engine

# Set the database URL to SQLite
os.environ["DATABASE_URL"] = "sqlite:///./todo_app.db"

# Import the database module after setting the environment variable
from config.database import engine, Base

print(f"Database URL: {os.getenv('DATABASE_URL')}")
print(f"Engine dialect: {engine.dialect.name}")

try:
    # Try to create tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
except Exception as e:
    print(f"Error creating tables: {e}")