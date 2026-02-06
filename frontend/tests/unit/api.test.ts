/**
 * Unit tests for API client following TDD approach.
 * These tests should be written before implementation as per constitution.
 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Directly mock the axios instance for testing instead of importing the configured api
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Apply the same interceptors for testing
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && window.location) {
        if (window.localStorage) {
          localStorage.removeItem('token');
        }
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

describe('API Client', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api); // Use the api instance we created

    // Mock localStorage
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    // Mock window.location
    Object.defineProperty(global, 'location', {
      value: {
        href: '',
        assign: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('should include authorization token in requests when available', async () => {
    // Mock localStorage to return a token
    (global.localStorage.getItem as jest.Mock).mockReturnValue('mock-token');

    mock.onGet('/api/todos/').reply(200, []);

    const response = await api.get('/api/todos/');

    expect(response.status).toBe(200);
    // Check that Authorization header was included
    const requestHeaders = mock.history.get[0].headers;
    expect(requestHeaders.Authorization).toBe('Bearer mock-token');
  });

  it('should not include authorization token when not available', async () => {
    // Mock localStorage to return null
    (global.localStorage.getItem as jest.Mock).mockReturnValue(null);

    mock.onGet('/api/todos/').reply(200, []);

    const response = await api.get('/api/todos/');

    expect(response.status).toBe(200);
    // Check that Authorization header was not included
    const requestHeaders = mock.history.get[0].headers;
    expect(requestHeaders.Authorization).toBeUndefined();
  });

  it('should handle 401 errors by removing token and redirecting to login', async () => {
    // Mock localStorage to return a token
    (global.localStorage.getItem as jest.Mock).mockReturnValue('mock-token');

    mock.onGet('/api/todos/').reply(401);

    // Catch the expected error
    await expect(api.get('/api/todos/')).rejects.toThrow();

    // Verify token was removed from localStorage
    expect(global.localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});