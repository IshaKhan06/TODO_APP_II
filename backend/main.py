from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.security import HTTPBearer

from config.database import engine, Base
from routes.auth import auth_router
from routes.todos import todos_router

# Security Scheme for Swagger
security = HTTPBearer()

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Create tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Todo API",
    description="Full-featured Todo API with JWT Authentication",
    version="1.0.0",
    lifespan=lifespan,

    # 👉 Yeh Swagger me Authorize system enable karega
    swagger_ui_parameters={
        "persistAuthorization": True
    }
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(todos_router, prefix="/api/todos", tags=["Todos"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Run server
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
