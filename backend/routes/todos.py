from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv

from models.todo import Todo
from config.database import get_db
from utils.auth import get_current_user
from pydantic import BaseModel

load_dotenv()

todos_router = APIRouter()

class TodoCreate(BaseModel):
    title: str
    description: str = None

class TodoUpdate(BaseModel):
    title: str = None
    description: str = None
    completed: bool = None

class TodoResponse(BaseModel):
    id: int
    title: str
    description: str
    completed: bool
    user_id: str

@todos_router.get("/", response_model=List[TodoResponse])
async def get_todos(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    todos = db.query(Todo).filter(Todo.user_id == current_user).all()
    return todos

@todos_router.post("/", response_model=TodoResponse)
async def create_todo(todo: TodoCreate, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    db_todo = Todo(
        title=todo.title,
        description=todo.description,
        user_id=current_user
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@todos_router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(todo_id: int, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == current_user).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@todos_router.put("/{todo_id}", response_model=TodoResponse)
async def update_todo(todo_id: int, todo_update: TodoUpdate, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == current_user).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    # Update fields if they are provided
    if todo_update.title is not None:
        todo.title = todo_update.title
    if todo_update.description is not None:
        todo.description = todo_update.description
    if todo_update.completed is not None:
        todo.completed = todo_update.completed

    db.commit()
    db.refresh(todo)
    return todo

@todos_router.delete("/{todo_id}")
async def delete_todo(todo_id: int, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == current_user).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted successfully"}