# Desafio Full Stack - Indicadores de Funcionários

Projeto desenvolvido para o desafio técnico de estágio Full Stack.

## Tecnologias

- Backend: FastAPI
- Frontend de cadastro: Angular
- Frontend de painel: React + Tailwind CSS
- Banco de dados: PostgreSQL
- Execução: Docker Compose

## Arquitetura

O fluxo principal da aplicação é:

Angular -> FastAPI -> PostgreSQL -> React

O Angular é responsável pelo cadastro dos indicadores.

O FastAPI recebe, valida e persiste os dados.

O React consulta a API e apresenta os indicadores em cartões, gráfico e tabela.

## Estrutura

- backend/
- frontend-angular/
- frontend-react/
- docker-compose.yml

## Endpoints

- POST /records
- GET /records
- GET /summary

Documentação automática da API:

http://localhost:8001/docs

## Execução com Docker

Na raiz do projeto:

docker compose up --build

Serviços:

- Angular: http://localhost:4200
- React: http://localhost:5173
- API: http://localhost:8001
- Swagger: http://localhost:8001/docs

## Execução local utilizada durante o desenvolvimento

Backend:

cd backend

.\venv\Scripts\Activate.ps1

uvicorn main:app --reload --port 8001

Angular:

cd frontend-angular

ng serve --port 4200

React:

cd frontend-react

npm run dev

## Funcionalidades implementadas

- Cadastro de funcionário e indicador pelo Angular
- Validação de quantidade de entregas não negativa
- Persistência de registros históricos
- Listagem de registros
- Resumo com total de registros e total de entregas
- Painel React com dois cartões
- Gráfico de entregas por departamento
- Tabela de registros
- Estados de carregamento e erro
- Documentação Swagger
- Dockerfiles e docker-compose.yml

## Banco de dados

A persistência com PostgreSQL 17 foi validada localmente durante o desenvolvimento.

O backend utiliza as tabelas:

- employees
- records

Foi validado o cadastro de registros por meio do endpoint POST /records utilizando PostgreSQL.

O SQLite foi utilizado inicialmente como fallback durante o desenvolvimento.

## Docker

A execução com Docker Compose foi validada utilizando WSL 2 com Ubuntu 24.04.

Os serviços executados foram:

- PostgreSQL
- FastAPI
- Angular
- React

## Limitações conhecidas

Não foram identificadas limitações impeditivas durante a validação local.