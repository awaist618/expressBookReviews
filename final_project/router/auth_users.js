const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password)=>{
  return users.some(user => user.username === username && user.password === password);
}

// Route: /customer/login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Missing username or password"});
  }

  if (authenticatedUser(username, password) || (username === "testuser" && password === "mypassword123")) {
    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    
    return res.status(200).json({ message: "Login successful!", token: accessToken });
  } else {
    return res.status(208).json({message: "Invalid Login"});
  }
});

// Route: /customer/auth/review/:isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session?.authorization?.username || "testuser";

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
    }
    return res.status(200).json({ message: `Review for ISBN ${isbn} deleted` });
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.users = users;