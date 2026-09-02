import os
from datetime import date, datetime

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
    func,
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship


# Banco de dados
# Por enquanto usamos SQLite para conseguir desenvolver nesta máquina.
# No Docker, depois apontaremos para PostgreSQL.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = (
    {"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


# Tabela de funcionários
class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department = Column(String, nullable=False)

    records = relationship("Record", back_populates="employee")


# Tabela de registros históricos
class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)

    reference_date = Column(Date, nullable=False)
    deliveries = Column(Integer, nullable=False)
    observation = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="records")


Base.metadata.create_all(bind=engine)


# Dados que a API espera receber
class RecordCreate(BaseModel):
    name: str
    department: str
    reference_date: date
    deliveries: int = Field(ge=0)
    observation: str | None = None


# Conexão com o banco
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


app = FastAPI(title="API de Indicadores de Funcionários")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "API funcionando"}


# Criar um registro
@app.post("/records")
def create_record(data: RecordCreate, db: Session = Depends(get_db)):

    employee = (
        db.query(Employee)
        .filter(
            Employee.name == data.name,
            Employee.department == data.department,
        )
        .first()
    )

    if employee is None:
        employee = Employee(
            name=data.name,
            department=data.department,
        )

        db.add(employee)
        db.commit()
        db.refresh(employee)

    record = Record(
        employee_id=employee.id,
        reference_date=data.reference_date,
        deliveries=data.deliveries,
        observation=data.observation,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "name": employee.name,
        "department": employee.department,
        "reference_date": record.reference_date,
        "deliveries": record.deliveries,
        "observation": record.observation,
    }


# Listar registros
@app.get("/records")
def list_records(db: Session = Depends(get_db)):

    records = (
        db.query(Record)
        .join(Employee)
        .order_by(Record.reference_date.desc())
        .all()
    )

    return [
        {
            "id": record.id,
            "name": record.employee.name,
            "department": record.employee.department,
            "reference_date": record.reference_date,
            "deliveries": record.deliveries,
            "observation": record.observation,
        }
        for record in records
    ]


# Resumo para o painel React
@app.get("/summary")
def summary(db: Session = Depends(get_db)):

    total_records = db.query(func.count(Record.id)).scalar() or 0

    total_deliveries = db.query(
        func.sum(Record.deliveries)
    ).scalar() or 0

    return {
        "total_records": total_records,
        "total_deliveries": total_deliveries,
    }