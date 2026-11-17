import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

backend_dir = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_dir))

import app as app_module
from db import Category, Theorem, TheoremCategoryLink, get_session


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        session.add_all([
            Category(id=1, name="logika"),
            Category(id=2, name="algebra"),
            Theorem(
                id=10,
                name="Twierdzenie testowe",
                type="THEOREM",
                statement="Treść twierdzenia",
            ),
            Theorem(
                id=11,
                name="Twierdzenie bez kategorii",
                type="LEMMA",
                statement="Twierdzenie bez przypisanych kategorii",
            ),
            TheoremCategoryLink(theorem_id=10, category_id=1),
            TheoremCategoryLink(theorem_id=10, category_id=2),
        ])
        session.commit()

    def override_get_session():
        with Session(engine) as session:
            yield session

    app_module.app.dependency_overrides[get_session] = override_get_session

    with TestClient(app_module.app) as test_client:
        yield test_client

    app_module.app.dependency_overrides.clear()
    SQLModel.metadata.drop_all(engine)
    engine.dispose()


def test_get_theorem_returns_theorem_and_all_categories(client):
    response = client.get("/api/theorems/10")

    assert response.status_code == 200
    assert response.json() == {
        "id": 10,
        "name": "Twierdzenie testowe",
        "type": "THEOREM",
        "statement": "Treść twierdzenia",
        "categories": [1, 2],
    }


def test_get_theorem_returns_empty_categories_when_unassigned(client):
    response = client.get("/api/theorems/11")

    assert response.status_code == 200
    assert response.json()["categories"] == []


def test_get_theorem_returns_404_for_unknown_theorem(client):
    response = client.get("/api/theorems/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Theorem not found."}