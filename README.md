# Todo Application - Full Stack Web App

This is a full-stack multi-user Todo application built with Next.js (frontend) and FastAPI (backend) with Neon Serverless PostgreSQL database and JWT authentication.

## Features

- ✅ Full-stack web application with Next.js 14 and FastAPI
- ✅ User authentication with JWT tokens
- ✅ User isolation - each user sees only their own tasks
- ✅ Complete CRUD operations for todos (Create, Read, Update, Delete)
- ✅ Responsive UI with Tailwind CSS
- ✅ REST API endpoints for all operations
- ✅ Secure authentication and authorization
- ✅ Modern tech stack with TypeScript

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS

## Project Structure

```
├── backend/
│   ├── main.py                 # Main FastAPI application
│   ├── models/                 # Database models
│   │   ├── todo.py             # Todo model
│   │   └── user.py             # User model
│   ├── routes/                 # API routes
│   │   ├── auth.py             # Authentication routes
│   │   └── todos.py            # Todo routes
│   ├── services/               # Business logic
│   ├── utils/                  # Utility functions
│   │   └── auth.py             # Authentication utilities
│   ├── config/                 # Configuration files
│   │   └── database.py         # Database configuration
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
├── frontend/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main todo page
│   │   └── login/page.tsx      # Login/register page
│   ├── components/             # Reusable components
│   │   └── navbar.tsx          # Navigation bar
│   ├── lib/                    # Utility functions
│   │   └── api.ts              # API client
│   ├── styles/                 # Global styles
│   ├── public/                 # Static assets
│   ├── package.json            # Node.js dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   ├── next.config.js          # Next.js configuration
│   └── tailwind.config.js      # Tailwind CSS configuration
└── README.md                   # Project documentation
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `.env`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your actual database connection string and secret key.

5. Run the backend server:
```bash
python main.py
```

The backend will run on `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Todos
- `GET /api/todos/` - Get all user's todos
- `POST /api/todos/` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo
- `PUT /api/todos/{id}` - Update a specific todo
- `DELETE /api/todos/{id}` - Delete a specific todo

## Security Features

- JWT-based authentication for all API requests
- User isolation - each user can only access their own todos
- Secure token storage and validation
- Input validation and sanitization

## Development

This project follows a spec-driven development approach with:
- Clear separation of frontend and backend responsibilities
- Comprehensive API documentation via FastAPI
- Type safety with TypeScript on the frontend
- Responsive design with Tailwind CSS

## Database Schema

The application uses PostgreSQL with the following tables:

**todos table:**
- id (Primary Key)
- title (String, not null)
- description (String, nullable)
- completed (Boolean, default false)
- user_id (String, foreign key to users)
- created_at (DateTime)
- updated_at (DateTime)

**users table:**
- id (Primary Key)
- email (String, unique, not null)
- name (String, nullable)
- created_at (DateTime)
- updated_at (DateTime)

## Testing

To run tests:
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

## Deployment

The application has been restructured for deployment to Vercel:
- The FastAPI backend has been converted to Next.js API routes
- All API endpoints are now served from the Next.js application
- The application can now be deployed entirely to Vercel

### Deploying to Vercel

1. Install the Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Link your project to Vercel:
```bash
vercel
```

4. Set the environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - `SECRET_KEY`: Your JWT secret key

5. Deploy the application:
```bash
vercel --prod
```
