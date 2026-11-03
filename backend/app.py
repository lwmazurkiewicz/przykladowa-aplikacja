from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from db import *

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

class TokenTo(BaseModel):
    access_token: str
    token_type: str

@app.post("/login", response_model=TokenTo)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    print(f"Login attempt: {form_data.username} / {form_data.password}")
    user = session.exec(select(User).where(User.username == form_data.username)).first();
    if not user or not password_hash.verify(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES));
    session.add(Token(access_token=token, user_id=user.id))
    session.commit()
    return TokenTo(access_token=token, token_type="bearer")

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: SessionDep):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        username = decode_access_token(token)
        if username is None:
            raise credentials_exception
    except:
        raise credentials_exception
    user = session.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception
    return user

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

class TheoremTo(BaseModel):
    id: int | None = None
    name: str
    type: str
    statement: str
    categories: list[int] = Field(default_factory=list)

@app.get("/theorems", response_model=list[TheoremTo])
def get_theorems(session: SessionDep):
    rows = session.exec(
        select(Theorem, TheoremCategoryLink.category_id)
        .outerjoin(
            TheoremCategoryLink,
            Theorem.id == TheoremCategoryLink.theorem_id,
        )
    ).all()

    theorems: dict[int, TheoremTo] = {}
    for theorem, category_id in rows:
        if theorem.id is None:
            continue

        if theorem.id not in theorems:
            theorems[theorem.id] = TheoremTo(
                id=theorem.id,
                name=theorem.name,
                type=theorem.type,
                statement=theorem.statement,
            )

        if category_id is not None:
            theorems[theorem.id].categories.append(category_id)

    return list(theorems.values())

@app.get("/theorems/{id}", response_model=list[TheoremTo])
def get_theorem(id: int, session: SessionDep):
    rows = session.exec(
        select(Theorem, TheoremCategoryLink.category_id)
        .outerjoin(
            TheoremCategoryLink,
            Theorem.id == TheoremCategoryLink.theorem_id,
        ).where(Theorem.id == id)
    ).all()

    theorems: dict[int, TheoremTo] = {}
    for theorem, category_id in rows:
        if theorem.id is None:
            continue

        if theorem.id not in theorems:
            theorems[theorem.id] = TheoremTo(
                id=theorem.id,
                name=theorem.name,
                type=theorem.type,
                statement=theorem.statement,
            )

        if category_id is not None:
            theorems[theorem.id].categories.append(category_id)

    return list(theorems.values())

@app.get("/categories")
def get_categories(session: SessionDep):
    categories = session.exec(select(Category)).all()
    return categories