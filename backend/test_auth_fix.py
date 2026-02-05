import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8001"

def test_auth_flow():
    print("Testing authentication flow...")

    # Test registration
    print("\n1. Testing registration...")
    register_data = {
        "email": "testuser@example.com",
        "password": "securepassword123"
    }

    try:
        register_response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
        print(f"Registration response: {register_response.status_code}")
        print(f"Registration data: {register_response.json()}")

        if register_response.status_code == 200:
            token_data = register_response.json()
            access_token = token_data['access_token']
            print("✓ Registration successful")
        else:
            print(f"✗ Registration failed: {register_response.text}")
            return False

    except Exception as e:
        print(f"✗ Registration error: {e}")
        return False

    # Test login with same credentials
    print("\n2. Testing login with registered credentials...")
    login_data = {
        "email": "testuser@example.com",
        "password": "securepassword123"
    }

    try:
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login response: {login_response.status_code}")

        if login_response.status_code == 200:
            login_token_data = login_response.json()
            login_access_token = login_token_data['access_token']
            print("✓ Login successful")
            print(f"Retrieved token: {login_token_data}")
        else:
            print(f"✗ Login failed: {login_response.text}")
            return False

    except Exception as e:
        print(f"✗ Login error: {e}")
        return False

    # Test login with wrong password
    print("\n3. Testing login with wrong password (should fail)...")
    wrong_login_data = {
        "email": "testuser@example.com",
        "password": "wrongpassword"
    }

    try:
        wrong_login_response = requests.post(f"{BASE_URL}/api/auth/login", json=wrong_login_data)
        print(f"Wrong password login response: {wrong_login_response.status_code}")

        if wrong_login_response.status_code == 401:
            print("✓ Correctly rejected wrong password")
        else:
            print(f"✗ Should have failed with wrong password: {wrong_login_response.text}")
            return False

    except Exception as e:
        print(f"✗ Wrong password test error: {e}")
        return False

    # Test registering same email again (should fail)
    print("\n4. Testing duplicate registration (should fail)...")
    duplicate_register_data = {
        "email": "testuser@example.com",
        "password": "anotherpassword"
    }

    try:
        dup_response = requests.post(f"{BASE_URL}/api/auth/register", json=duplicate_register_data)
        print(f"Duplicate registration response: {dup_response.status_code}")

        if dup_response.status_code == 400:
            print("✓ Correctly rejected duplicate registration")
        else:
            print(f"✗ Should have failed with duplicate registration: {dup_response.text}")
            return False

    except Exception as e:
        print(f"✗ Duplicate registration test error: {e}")
        return False

    print("\n✓ All authentication tests passed!")
    return True

if __name__ == "__main__":
    print("Starting authentication system test...")
    success = test_auth_flow()

    if success:
        print("\n🎉 Authentication system is working correctly!")
        print("Users can now register and login successfully.")
    else:
        print("\n❌ Authentication system has issues.")