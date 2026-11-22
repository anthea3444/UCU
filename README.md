# UCU Campus Lost and Found System

A web app where UCU students report lost and found items and claim them. Built with React, Node/Express and MySQL.

## Project structure

```
client/    React website (Vite)
server/    Express backend and API
database/  schema.sql (tables) and seed.sql (sample data)
```

## What you need first

- Node.js
- MySQL

## Setup

### 1. Database

Open MySQL and run these two files in order:

1. `database/schema.sql` (creates the tables)
2. `database/seed.sql` (adds the sample admin and students)

### 2. Backend

```bash
cd server
npm install
```

Copy `.env.example` to a new file called `.env` and fill in your own values (database details and JWT secret). Then start the server:

```bash
npm start
```

The backend runs on http://localhost:5001

### 3. Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The website runs on http://localhost:5173

## Features built so far

- Student registration
- Login with JWT
- Logout (the token is revoked on the server)
- Roles (student and admin)
- Protected pages (you must be logged in)

## API routes

| Method | Route | What it does |
|--------|-------|--------------|
| POST | /api/auth/register | Create a student account |
| POST | /api/auth/login | Log in and get a token |
| POST | /api/auth/logout | Log out (needs a token) |

## Test accounts

The sample accounts are in `database/seed.sql`.