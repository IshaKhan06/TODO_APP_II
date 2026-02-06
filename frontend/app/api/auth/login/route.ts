import { NextRequest } from 'next/server';
import { UserService } from '@/lib/userService';
import { createAccessToken } from '@/lib/token';
import { initializeDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate the user
    const user = await UserService.authenticateUser(email, password);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Incorrect email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
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
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}