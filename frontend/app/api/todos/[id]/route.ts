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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    const todoId = parseInt(params.id);

    if (isNaN(todoId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid todo ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get specific todo for the authenticated user
    const result = await query(
      'SELECT id, title, description, completed, user_id, created_at, updated_at FROM todos WHERE id = $1 AND user_id = $2',
      [todoId, userId]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Todo not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const todo = {
      ...result.rows[0],
      completed: Boolean(result.rows[0].completed),
      created_at: result.rows[0].created_at ? new Date(result.rows[0].created_at).toISOString() : null,
      updated_at: result.rows[0].updated_at ? new Date(result.rows[0].updated_at).toISOString() : null,
    };

    return new Response(JSON.stringify(todo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get todo error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const todoId = parseInt(params.id);

    if (isNaN(todoId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid todo ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { title, description, completed } = await req.json();

    // Check if todo exists and belongs to user
    const existingTodoResult = await query(
      'SELECT id FROM todos WHERE id = $1 AND user_id = $2',
      [todoId, userId]
    );

    if (existingTodoResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Todo not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let valueIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${valueIndex}`);
      values.push(title);
      valueIndex++;
    }

    if (description !== undefined) {
      updates.push(`description = $${valueIndex}`);
      values.push(description);
      valueIndex++;
    }

    if (completed !== undefined) {
      updates.push(`completed = $${valueIndex}`);
      values.push(completed);
      valueIndex++;
    }

    // Add user_id and todo_id to values
    values.push(userId);
    values.push(todoId);

    if (updates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No fields to update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the todo
    const updateQuery = `
      UPDATE todos SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${valueIndex} AND user_id = $${valueIndex - 1}
      RETURNING *
    `;

    const result = await query(updateQuery, values);

    const updatedTodo = {
      ...result.rows[0],
      completed: Boolean(result.rows[0].completed),
      created_at: result.rows[0].created_at ? new Date(result.rows[0].created_at).toISOString() : null,
      updated_at: result.rows[0].updated_at ? new Date(result.rows[0].updated_at).toISOString() : null,
    };

    return new Response(JSON.stringify(updatedTodo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update todo error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const todoId = parseInt(params.id);

    if (isNaN(todoId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid todo ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if todo exists and belongs to user
    const existingTodoResult = await query(
      'SELECT id FROM todos WHERE id = $1 AND user_id = $2',
      [todoId, userId]
    );

    if (existingTodoResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Todo not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the todo
    await query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2',
      [todoId, userId]
    );

    return new Response(JSON.stringify({ message: 'Todo deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}