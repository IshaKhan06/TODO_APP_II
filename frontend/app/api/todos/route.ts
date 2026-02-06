import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/lib/middleware';
import { query, initializeDatabase } from '@/lib/db';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export async function GET(req: NextRequest) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    // Authenticate the user
    const userId = await authenticateRequest(req);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get todos for the authenticated user
    const result = await query(
      'SELECT id, title, description, completed, user_id, created_at, updated_at FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const todos = result.rows.map(row => ({
      ...row,
      completed: Boolean(row.completed),
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    }));

    return new Response(JSON.stringify(todos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get todos error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    // Authenticate the user
    const userId = await authenticateRequest(req);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { title, description } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new todo
    const result = await query(
      'INSERT INTO todos (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description || null, userId]
    );

    const newTodo = {
      ...result.rows[0],
      completed: Boolean(result.rows[0].completed),
      created_at: result.rows[0].created_at ? new Date(result.rows[0].created_at).toISOString() : null,
      updated_at: result.rows[0].updated_at ? new Date(result.rows[0].updated_at).toISOString() : null,
    };

    return new Response(JSON.stringify(newTodo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create todo error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}