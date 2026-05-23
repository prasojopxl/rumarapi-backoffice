# Compro CMS Monorepo

## Requirement
- Node.js minimal v18.17.0
- MySQL

## Struktur
- `frontend` untuk aplikasi UI CMS (Vite + React)
- `backend` untuk API CMS (Express + TypeScript + Prisma)

## Install
1. Jalankan `npm install` dari root project.

## Menjalankan Project
1. Backend (API): `npm run dev:be`
2. Frontend (UI): `npm run dev:fe`

## Build Project
1. Build backend: `npm run build:be`
2. Build frontend: `npm run build:fe`
3. Build semuanya: `npm run build`

## API Docs (Swagger)
1. Jalankan backend: `npm run dev:be`
2. Buka Swagger UI: `http://localhost:7001/docs`
3. OpenAPI JSON: `http://localhost:7001/docs.json`