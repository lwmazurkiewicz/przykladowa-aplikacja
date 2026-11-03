from typing import Annotated
from fastapi import Path, Query, FastAPI, status

app = FastAPI();

@app.get("/")
def root():
    return "Hello World!"

@app.get("/tasks/{task_id}", description="Metoda zwracająca zadanie o podanym identyfikatorze")
def get_task(task_id: int):
    return {"id": task_id}

@app.get("/tasks")
def list_tasks(
    completed: bool | None = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20
):
    """
    Metoda wypisująca zadania z opcjonalnym filtrowaniem po statusie ukończenia i ograniczeniem liczby wyników
    """
    return {
        "completed": completed,
        "limit": limit
    }

from pydantic import BaseModel, Field

class TaskCreate(BaseModel):
    title: str = Field(min_length=3, max_length=100, title="Tytuł zadania")
    description: str | None = Field(description="Opis zadania")

class TaskRead(BaseModel):
    id: int
    title: str
    description: str | None
    completed: bool

tasks = list[TaskRead]()
@app.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate):
    new_task = {
        "id": len(tasks) + 1,
        "title": task.title,
        "description": task.description,
        "completed": False
    }
    tasks.append(new_task)
    return new_task

from fastapi import HTTPException

@app.get("/tasks/{task_id}", response_model=TaskRead)
def get_task(task_id: int):
    task = next(
        (task for task in tasks if task["id"] == task_id),
        None
    )

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Nie znaleziono zadania"
        )

    return task

from fastapi import Cookie, Header

@app.get("/items/")
def read_items(user_agent: Annotated[str | None, Header()] = None,
                ads_id: Annotated[str | None, Cookie()] = None):
    return {"User-Agent": user_agent, "ads-id": ads_id}

@app.put("/items/{item_id}")
def update_item(item_id: Annotated[int, Path(title="Identyfikator zadania")],
                item: TaskCreate,
                user: TaskRead,
                q: Annotated[str | None, Query(title="Parametr zapytania")] = None):
    results = {"item_id": item_id, "query": q, "item": item, "user": user}
    return results