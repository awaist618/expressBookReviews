const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/books', function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const bookData = response.data || books;
    const isbn = req.params.isbn;

    if (bookData[isbn]) {
      return res.status(200).json(bookData[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const bookData = response.data || books;
    const author = req.params.author.toLowerCase();
    const matching = Object.keys(bookData)
      .filter(key => bookData[key].author.toLowerCase() === author)
      .map(key => ({ isbn: key, ...bookData[key] }));

    return res.status(200).json(matching);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const bookData = response.data || books;
    const title = req.params.title.toLowerCase();
    const matching = Object.keys(bookData)
      .filter(key => bookData[key].title.toLowerCase() === title)
      .map(key => ({ isbn: key, ...bookData[key] }));

    return res.status(200).json(matching);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews || {});
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;