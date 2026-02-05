/**
 * Unit tests for API client following TDD approach.
 * These tests should be written before implementation as per constitution.
 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api from '../../lib/api';

describe('API Client', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should include authorization token in requests when available', async () => {
    // Mock localStorage to return a token
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    mock.onGet('/api/todos/').reply(200, []);

    const response = await api.get('/api/todos/');

    expect(response.status).toBe(200);
    // Check that Authorization header was included
    expect(mock.history.get[0].headers?.Authorization).toBe('Bearer mock-token');
  });

  it('should not include authorization token when not available', async () => {
    // Mock localStorage to return null
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    mock.onGet('/api/todos/').reply(200, []);

    const response = await api.get('/api/todos/');

    expect(response.status).toBe(200);
    // Check that Authorization header was not included
    expect(mock.history.get[0].headers?.Authorization).toBeUndefined();
  });

  it('should handle 401 errors by redirecting to login', async () => {
    // Mock localStorage and window.location
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    const assignMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock },
      writable: true,
    });

    mock.onGet('/api/todos/').reply(401);

    try {
      await api.get('/api/todos/');
    } catch (error) {
      // Expected to throw
    }

    // Verify token was removed from localStorage
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    // Verify redirect to login page
    expect(window.location.assign).toHaveBeenCalledWith('/login');
  });
});