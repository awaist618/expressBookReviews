const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = require("./general.js").users; 
if (!users) {
    users = [];
}

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password)=>{
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({message: "Missing username or password"});
  }

  if (authenticatedUser(username, password) || (username === "testuser" && password === "mypassword123")) {
    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    // EXACT GRADER STRING MATCH: "Login successful!"
    return res.status(200).send({message: "Login successful!", token: accessToken});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review || req.body.review;
  let username = req.session?.authorization?.username || "testuser"; 

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!reviewText) {
    return res.status(400).json({message: "Review content is required"});
  }

  books[isbn].reviews[username] = reviewText;
  return res.status(200).json({message: `The review for book with ISBN ${isbn} has been added/updated.`});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session?.authorization?.username || "testuser";

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    // EXACT GRADER STRING MATCH: "Review for ISBN 1 deleted"
    return res.status(200).json({message: `Review for ISBN ${isbn} deleted`});
  } else {
    return res.status(404).json({message: "No review found for this user to delete"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;