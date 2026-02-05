"""
Unit tests for authentication utilities following TDD approach.
These tests should be written before implementation as per constitution.
"""
import pytest
from datetime import datetime, timedelta
from jose import jwt
import os
from utils.auth import create_access_token, verify_token


def test_create_access_token():
    """Test creating an access token"""
    data = {"sub": "user123", "email": "test@example.com"}
    token = create_access_token(data)

    assert isinstance(token, str)
    assert len(token) > 0


def test_create_access_token_with_expiration():
    """Test creating an access token with custom expiration"""
    data = {"sub": "user123", "email": "test@example.com"}
    expires_delta = timedelta(minutes=15)
    token = create_access_token(data, expires_delta=expires_delta)

    assert isinstance(token, str)
    assert len(token) > 0


def test_verify_valid_token():
    """Test verifying a valid token"""
    # Create a token using the same secret as in the app
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM = "HS256"

    data = {"sub": "user123", "email": "test@example.com"}
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    user_id = verify_token(token)
    assert user_id == "user123"


def test_verify_invalid_token():
    """Test verifying an invalid token raises exception"""
    invalid_token = "invalid.token.here"

    with pytest.raises(Exception):
        verify_token(invalid_token)


def test_verify_expired_token():
    """Test verifying an expired token raises exception"""
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM = "HS256"

    # Create an expired token
    expired_data = {
        "sub": "user123",
        "exp": datetime.utcnow() - timedelta(seconds=1)  # Expired 1 second ago
    }
    expired_token = jwt.encode(expired_data, SECRET_KEY, algorithm=ALGORITHM)

    with pytest.raises(Exception):
        verify_token(expired_token)