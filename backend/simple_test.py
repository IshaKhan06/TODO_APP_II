from fastapi.testclient import TestClient
from main import app

# Create test client
client = TestClient(app)

# Test the endpoints
print("Testing endpoints...")

# Test root endpoint
response = client.get("/")
print(f"Root endpoint status: {response.status_code}")
print(f"Root endpoint response: {response.json()}")

# Test health endpoint
response = client.get("/health")
print(f"Health endpoint status: {response.status_code}")
print(f"Health endpoint response: {response.json()}")

# Test todos endpoint (should return 401 since no auth)
response = client.get("/api/todos/")
print(f"Todos endpoint status: {response.status_code}")

print("All tests completed!")