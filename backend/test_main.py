import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo API is running!"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_get_todos_unauthorized():
    # Test that accessing todos endpoint without auth returns 401
    response = client.get("/api/todos/")
    assert response.status_code == 401

def test_create_todo_unauthorized():
    # Test that creating todo without auth returns 401
    response = client.post("/api/todos/", json={
        "title": "Test todo",
        "description": "Test description"
    })
    assert response.status_code == 401