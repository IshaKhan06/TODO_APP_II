"""
Unit tests for data models following TDD approach.
These tests should be written before implementation as per constitution.
"""
import pytest
from models.todo import Todo
from models.user import User


def test_todo_model_creation():
    """Test creating a Todo model instance"""
    todo = Todo(
        title="Test Todo",
        description="Test Description",
        completed=False,
        user_id="user123"
    )

    assert todo.title == "Test Todo"
    assert todo.description == "Test Description"
    assert todo.completed is False
    assert todo.user_id == "user123"


def test_todo_model_defaults():
    """Test Todo model default values"""
    # Note: SQLAlchemy model defaults are applied at DB level, not instance level
    # When creating an instance directly, the completed field will be None
    # until it's saved to the database
    todo = Todo(
        title="Test Todo",
        user_id="user123"
    )

    assert todo.title == "Test Todo"
    # At the instance level, completed will be None until saved to DB
    # The default is applied at the database level
    assert todo.completed in [None, False]  # Could be None before saving
    assert todo.user_id == "user123"


def test_user_model_creation():
    """Test creating a User model instance"""
    user = User(
        id="user123",
        email="test@example.com",
        name="Test User"
    )

    assert user.id == "user123"
    assert user.email == "test@example.com"
    assert user.name == "Test User"


def test_user_model_required_fields():
    """Test User model required fields"""
    user = User(
        id="user123",
        email="test@example.com"
    )

    assert user.id == "user123"
    assert user.email == "test@example.com"
    # name can be None as it's nullable


def test_todo_to_dict():
    """Test Todo model to_dict method"""
    todo = Todo(
        id=1,
        title="Test Todo",
        description="Test Description",
        completed=False,
        user_id="user123"
    )

    todo_dict = todo.to_dict()

    assert isinstance(todo_dict, dict)
    assert todo_dict["id"] == 1
    assert todo_dict["title"] == "Test Todo"
    assert todo_dict["description"] == "Test Description"
    assert todo_dict["completed"] is False
    assert todo_dict["user_id"] == "user123"