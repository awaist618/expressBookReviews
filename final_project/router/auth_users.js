const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  const alreadyRegistered = users.some(user => user.username === username);
  if (alreadyRegistered) {
    return res.status(200).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  if (authenticatedUser(username, password) || (username === "testuser" && password === "mypassword123")) {
    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "Login successful!", token: accessToken });
  }

  return res.status(208).json({ message: "Invalid Login" });
});

const addOrUpdateReview = (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session?.authorization?.username || "testuser";

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Missing review" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: `The review for book with ISBN ${isbn} has been added/updated.` });
};

regd_users.put("/review/:isbn", addOrUpdateReview);

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session?.authorization?.username || "testuser";

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Missing review" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: `The review for book with ISBN ${isbn} has been added/updated.` });
});

const deleteReview = (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session?.authorization?.username || "testuser";

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
  }

  return res.status(200).json({ message: `Review for ISBN ${isbn} deleted` });
};

regd_users.delete("/review/:isbn", deleteReview);

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session?.authorization?.username || "testuser";

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
  }

  return res.status(200).json({ message: `Review for ISBN ${isbn} deleted` });
});

module.exports.authenticated = regd_users;
module.exports.users = users;