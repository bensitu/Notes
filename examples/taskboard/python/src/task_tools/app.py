"""A local learning API backed by SQLite."""

from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Response
from pydantic import BaseModel, ConfigDict, Field, StringConstraints
from sqlalchemy import Boolean, Integer, String, create_engine, select, update
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


class Base(DeclarativeBase):
    pass


class Task(Base):
    __tablename__ = "task"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    done: Mapped[bool] = mapped_column(Boolean, default=False)
    version: Mapped[int] = mapped_column(Integer, default=0)


Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]


class TaskInput(BaseModel):
    title: Title


class TaskUpdate(TaskInput):
    done: bool
    version: int = Field(ge=0)


class TaskOutput(TaskInput):
    model_config = ConfigDict(from_attributes=True)
    id: int
    done: bool
    version: int


def create_app(database_url: str = "sqlite:///./tasks.db") -> FastAPI:
    connect_args = {"check_same_thread": False} if database_url.startswith("sqlite:") else {}
    engine = create_engine(database_url, connect_args=connect_args)

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        Base.metadata.create_all(engine)
        try:
            yield
        finally:
            engine.dispose()

    app = FastAPI(lifespan=lifespan)

    def session():
        with Session(engine) as value:
            yield value

    Database = Annotated[Session, Depends(session)]

    @app.get("/api/tasks", response_model=list[TaskOutput])
    def list_tasks(db: Database):
        return db.scalars(select(Task).order_by(Task.id.desc()).limit(100)).all()

    @app.get("/api/tasks/{task_id}", response_model=TaskOutput)
    def get_task(task_id: int, db: Database):
        task = db.get(Task, task_id)
        if task is None:
            raise HTTPException(404, "Task was not found")
        return task

    @app.post("/api/tasks", response_model=TaskOutput, status_code=201)
    def create_task(body: TaskInput, response: Response, db: Database):
        task = Task(title=body.title)
        db.add(task)
        db.commit()
        db.refresh(task)
        response.headers["Location"] = f"/api/tasks/{task.id}"
        return task

    @app.put("/api/tasks/{task_id}", response_model=TaskOutput)
    def update_task(task_id: int, body: TaskUpdate, db: Database):
        result = db.execute(
            update(Task)
            .where(Task.id == task_id, Task.version == body.version)
            .values(title=body.title, done=body.done, version=Task.version + 1)
        )
        if result.rowcount != 1:
            db.rollback()
            if db.get(Task, task_id) is None:
                raise HTTPException(404, "Task was not found")
            raise HTTPException(409, "Task changed; reload and try again")
        db.commit()
        return db.get(Task, task_id)

    return app
