from sqlmodel import Field, Session, SQLModel, create_engine, select
from auth import *

class Theorem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    type: str = Field(index=True)
    statement: str = Field()

class Category(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)

class TheoremCategoryLink(SQLModel, table=True):
    theorem_id: int = Field(foreign_key="theorem.id", primary_key=True)
    category_id: int = Field(foreign_key="category.id", primary_key=True)

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    password: str
    isAdmin: bool = Field(default=False)

class Token(SQLModel, table=True):
    id: int = Field(primary_key=True)
    access_token: str = Field(index=True)


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        if session.get(Category, 1) is None:
            session.add(Category(id=1, name="logika"))
            session.add(Category(id=2, name="analiza"))
            session.add(Category(id=3, name="algebra"))
            session.add(Category(id=4, name="topologia"))
            session.add(Category(id=5, name="teoria miary"))
            session.add(Category(id=6, name="rachunek prawdopodobieństwa"))

            session.add(Theorem(id=1, name="Zdanie", type="DEFINITION", statement="Zmienne zdaniowe są zdaniami. Jeśli \\(\\phi\\) oraz \\(\\psi\\) są zdaniami, to \\(\\neg\\phi\\), \\(\\phi\\lor\\psi\\), \\(\\phi\\land\\psi\\), \\(\\phi\\rightarrow\\psi\\), \\(\\phi\\leftrightarrow\\psi\\) też są zdaniami."))
            session.add(Theorem(id=2, name="Lemat Kuratowskiego-Zorna", type="LEMMA", statement="Jeśli w częściowym porządku każdy niepusty łańcuch ma ograniczenie górne, to istnieje w tym porządku element maksymalny."))
            session.add(Theorem(id=3, name="Aksjomat zbioru pustego", type="AXIOM", statement="Istnieje zbiór pusty, tzn. \\[(\\exists a)(\\forall x)(x\\notin a).\\]"))
            session.add(Theorem(id=4, name="Twierdzenie o arytmetyce granic", type="THEOREM", statement="Jeśli \\(\\lim_{n\\to\\infty}a_n=a\\) i \\(\\lim_{n\\to\\infty}b_n=b\\), to \\(\\lim_{n\\to\\infty}(a_n+b_n)=a+b\\)."))

            session.add(TheoremCategoryLink(theorem_id=1, category_id=1))
            session.add(TheoremCategoryLink(theorem_id=2, category_id=1))
            session.add(TheoremCategoryLink(theorem_id=3, category_id=1))
            session.add(TheoremCategoryLink(theorem_id=4, category_id=2))

            session.add(User(id=1, username="admin", password=password_hash.hash("admin"), isAdmin=True))
            session.commit()