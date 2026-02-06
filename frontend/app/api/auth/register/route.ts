import { NextRequest } from 'next/server';
import { UserService } from '@/lib/userService';
import { createAccessToken } from '@/lib/token';
import { initializeDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    const { email, password, name } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const existingUser = await UserService.getUserByEmail(email);

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new user
    const user = await UserService.createUser(email, password, name);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create access token
    const accessToken = await createAccessToken({
      sub: user.id,
      email: user.email,
    });

    return new Response(
      JSON.stringify({
        access_token: accessToken,
        token_type: 'bearer'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}