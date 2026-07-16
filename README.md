# Gard Backend

A modern Express.js API project structure using ES Modules.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd gard-be
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

4. **Run the application:**
   - Development mode (with live reloading using nodemon):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

## Folder Structure

```text
src/
├── config/          # Configurations (db, env variables, etc.)
├── controllers/     # Controller logic (request handlers)
├── middlewares/     # Custom middlewares (auth, error handlers)
├── models/          # Database models (Mongoose schemas, etc.)
├── routes/          # Express route definitions
├── services/        # Business logic separation from controllers
├── utils/           # Shared helper functions
├── app.js           # App setup, middleware integration
└── server.js        # Server entry point (listening on port)
```
