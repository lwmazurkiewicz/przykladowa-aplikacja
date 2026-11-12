from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from db import *

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

class TokenTo(BaseModel):
    access_token: str
    token_type: str

@app.post("/api/login", response_model=TokenTo)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep, response: Response):
    user = session.exec(select(User).where(User.username == form_data.username)).first();
    if not user or not password_hash.verify(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    token = create_access_token(user.username, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES));
    session.add(Token(access_token=token, user_id=user.id))
    session.commit()
    response.set_cookie(
        key="refresh_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        # path="/auth",
        # max_age=604800,
    )
    return TokenTo(access_token=token, token_type="bearer")

@app.post("/api/logout", status_code=204)
def logout(response: Response):
    response.delete_cookie(
        key="refresh_token",
        path="/auth",
        secure=True,
        httponly=True,
        samesite="lax",
    )

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

@app.get("/api/theorems", response_model=list[TheoremTo])
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

@app.get("/api/theorems/{id}", response_model=TheoremTo)
def get_theorem(id: int, session: SessionDep):
    rows = session.exec(
        select(Theorem, TheoremCategoryLink.category_id)
        .outerjoin(
            TheoremCategoryLink,
            Theorem.id == TheoremCategoryLink.theorem_id,
        ).where(Theorem.id == id)
    ).first();

    return TheoremTo(
        id=rows[0].id,
        name=rows[0].name,
        type=rows[0].type,
        statement=rows[0].statement,
        categories=[rows[1]] if rows[1] is not None else [],
    );

@app.get("/api/categories")
def get_categories(session: SessionDep):
    categories = session.exec(select(Category)).all()
    return categories


@app.post("/api/theorems", response_model=TheoremTo, status_code=status.HTTP_201_CREATED)
def create_theorem(theorem: TheoremTo, session: SessionDep, user: Annotated[User, Depends(get_current_user)]):
    if not user.isAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to create a theorem.",
        )
    category_ids = list(dict.fromkeys(theorem.categories))
    if category_ids:
        existing_category_ids = set(
            session.exec(
                select(Category.id).where(Category.id.in_(category_ids))
            ).all()
        )
        missing_category_ids = set(category_ids) - existing_category_ids
        if missing_category_ids:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Unknown category IDs: {sorted(missing_category_ids)}",
            )

    new_theorem = Theorem(
        name=theorem.name,
        type=theorem.type,
        statement=theorem.statement,
    )
    session.add(new_theorem)
    session.flush()
    if new_theorem.id is None:
        raise RuntimeError("The database did not assign a theorem ID")

    session.add_all(
        TheoremCategoryLink(theorem_id=new_theorem.id, category_id=category_id)
        for category_id in category_ids
    )
    session.commit()
    session.refresh(new_theorem)

    return TheoremTo(
        id=new_theorem.id,
        name=new_theorem.name,
        type=new_theorem.type,
        statement=new_theorem.statement,
        categories=category_ids,
    )


@app.put("/api/theorems/{id}", response_model=TheoremTo)
def update_theorem(
    id: int,
    theorem: TheoremTo,
    session: SessionDep,
    user: Annotated[User, Depends(get_current_user)]
):
    if not user.isAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update a theorem.",
        )

    existing_theorem = session.get(Theorem, id)
    if existing_theorem is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theorem not found.",
        )

    category_ids = list(dict.fromkeys(theorem.categories))
    if category_ids:
        existing_category_ids = set(
            session.exec(
                select(Category.id).where(Category.id.in_(category_ids))
            ).all()
        )
        missing_category_ids = set(category_ids) - existing_category_ids
        if missing_category_ids:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Unknown category IDs: {sorted(missing_category_ids)}",
            )

    existing_theorem.name = theorem.name
    existing_theorem.type = theorem.type
    existing_theorem.statement = theorem.statement

    existing_links = session.exec(
        select(TheoremCategoryLink).where(TheoremCategoryLink.theorem_id == id)
    ).all()
    for link in existing_links:
        session.delete(link)
    session.add_all(
        TheoremCategoryLink(theorem_id=id, category_id=category_id)
        for category_id in category_ids
    )

    session.commit()
    session.refresh(existing_theorem)
    return TheoremTo(
        id=existing_theorem.id,
        name=existing_theorem.name,
        type=existing_theorem.type,
        statement=existing_theorem.statement,
        categories=category_ids,
    )
