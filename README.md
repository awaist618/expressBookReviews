# Secure Book Review API

A secure RESTful Book Review API built with Node.js and Express.js for managing books and user-authored reviews. The project includes user registration and login with JWT authentication, protected review CRUD operations, and public endpoints for retrieving books by ISBN, author, or title.

## Tech Stack
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- Express Session
- Axios

## Key Features
- User registration and login
- Secure review add/update/delete routes with authentication
- Public book retrieval by ISBN, author, and title
- In-memory book data store for quick testing and demo purposes

## Getting Started
1. Clone the repository.
2. Install dependencies:
   ```bash
   cd final_project
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```
4. The API will run at http://localhost:5000

## Example Endpoints
- GET / — retrieve all books
- GET /isbn/1 — retrieve a book by ISBN
- GET /author/Chinua%20Achebe — retrieve books by author
- GET /title/Fairy%20tales — retrieve books by title
- POST /register — register a new user
- POST /login — log in a user
- PUT /customer/auth/review/1 — add or update a review
- DELETE /customer/auth/review/1 — delete a review
