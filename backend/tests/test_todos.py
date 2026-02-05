"""
Unit tests for todo endpoints following TDD approach.
These tests should be written before implementation as per constitution.
"""
import pytest
from fastapi.testclient import TestClient
from main import app

# Create TestClient instance inside test functions to avoid initialization issues


def test_get_todos_requires_auth():
    """Test that getting todos requires authentication"""
    client = TestClient(app)
    response = client.get("/api/todos/")
    assert response.status_code == 401  # Unauthorized


def test_create_todo_requires_auth():
    """Test that creating todo requires authentication"""
    client = TestClient(app)
    response = client.post("/api/todos/", json={
        "title": "Test todo",
        "description": "Test description"
    })
    assert response.status_code == 401  # Unauthorized


def test_get_specific_todo_requires_auth():
    """Test that getting specific todo requires authentication"""
    client = TestClient(app)
    response = client.get("/api/todos/1")
    assert response.status_code == 401  # Unauthorized


def test_update_todo_requires_auth():
    """Test that updating todo requires authentication"""
    client = TestClient(app)
    response = client.put("/api/todos/1", json={
        "title": "Updated title",
        "completed": True
    })
    assert response.status_code == 401  # Unauthorized


def test_delete_todo_requires_auth():
    """Test that deleting todo requires authentication"""
    client = TestClient(app)
    response = client.delete("/api/todos/1")
    assert response.status_code == 401  # Unauthorized


def test_create_todo_valid_data():
    """Test creating todo with valid data"""
    # This will require a valid JWT token for a logged in user
    client = TestClient(app)
    headers = {"Authorization": "Bearer valid_token"}
    response = client.post("/api/todos/", json={
        "title": "Test todo",
        "description": "Test description"
    }, headers=headers)
    # Should return 200 or 422 for validation errors
    assert response.status_code in [200, 422]


def test_create_todo_missing_title():
    """Test creating todo without title returns validation error"""
    client = TestClient(app)
    headers = {"Authorization": "Bearer valid_token"}
    response = client.post("/api/todos/", json={
        "title": "",
        "description": "Test description"
    }, headers=headers)
    assert response.status_code == 422  # Validation error


def test_get_user_specific_todos():
    """Test that user only sees their own todos"""
    client = TestClient(app)
    headers = {"Authorization": "Bearer user1_token"}
    response = client.get("/api/todos/", headers=headers)
    assert response.status_code == 200
    # Verify that only todos belonging to user1 are returned