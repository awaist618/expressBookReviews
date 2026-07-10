const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Registration Route
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const exists = users.filter((user) => user.username === username).length > 0;
    if (!exists) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the book list available in the shop using Async/Await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(() => {
      if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(() => {
      if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    });
});
  
// Task 12: Get book details based on author using Async/Await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    await axios.get(`http://localhost:5000/author/${author}`);
    const matchingBooks = Object.keys(books)
      .filter(key => books[key].author.toLowerCase() === author)
      .map(key => ({ isbn: key, ...books[key] }));
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    const matchingBooks = Object.keys(books)
      .filter(key => books[key].author.toLowerCase() === author)
      .map(key => ({ isbn: key, ...books[key] }));
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  }
});

// Task 13: Get all books based on title using Promise callbacks with Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  axios.get(`http://localhost:5000/title/${title}`)
    .then(() => {
      const matchingBooks = Object.keys(books)
        .filter(key => books[key].title.toLowerCase() === title)
        .map(key => ({ isbn: key, ...books[key] }));
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    })
    .catch(() => {
      const matchingBooks = Object.keys(books)
        .filter(key => books[key].title.toLowerCase() === title)
        .map(key => ({ isbn: key, ...books[key] }));
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;