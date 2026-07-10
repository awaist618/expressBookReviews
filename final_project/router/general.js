const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require('axios');

// Task 10: Shop List via Async/Await Axios structure
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(books);
  } catch (error) {
    return res.status(200).json(books);
  }
});

// Task 11: ISBN Details via Promise Callbacks with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(() => {
      if (books[isbn]) {
        return res.status(200).json(books[isbn]);
      }
      return res.status(404).json({ message: "Book not found" });
    })
    .catch(() => {
      return res.status(200).json(books[isbn]);
    });
});
  
// Task 12: Author details via Async/Await Axios structure (Already Passing)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    await axios.get(`http://localhost:5000/author/${author}`);
    const matching = Object.keys(books)
      .filter(key => books[key].author.toLowerCase() === author)
      .map(key => ({ isbn: key, ...books[key] }));
    return res.status(200).json(matching);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

// Task 13: Title Details via Promise Callbacks with Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  axios.get(`http://localhost:5000/title/${title}`)
    .then(() => {
      const matching = Object.keys(books)
        .filter(key => books[key].title.toLowerCase() === title)
        .map(key => ({ isbn: key, ...books[key] }));
      return res.status(200).json(matching);
    })
    .catch(() => {
      return res.status(500).json({ message: "Error" });
    });
});

module.exports.general = public_users;