const express = require("express");
let books = require("./booksdb.js");
const { getbooks, getBooksByTitle } = require("./newMethods.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password)
    return res
      .status(400)
      .json({ status: 400, message: "Username or Password value is missing." });

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   //Write your code here
//   return res.status(200).json({ status: 200, books: JSON.stringify(books) });
// });

public_users.get("/", (req, res) => {
  getbooks((error, books) => {
    if (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Error al obtener libros" });
    }
    return res.status(200).json({ status: 200, books: JSON.stringify(books) });
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;

  const booksArray = Object.values(books);

  const filter = booksArray.filter((book) => book?.isbn === isbn);

  return res
    .status(200)
    .json({ status: 200, book: filter[0] ?? `There is no book with ${isbn}` });

  // Hacemos una llamada a la API simulando obtener los libros
  axios
    .get("https://api.example.com/books")
    .then((response) => {
      const booksArray = response.data;

      // Filtramos el libro por ISBN
      const filter = booksArray.filter((book) => book?.isbn === isbn);

      return res.status(200).json({
        status: 200,
        book: filter[0] ?? `There is no book with ISBN ${isbn}`,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        message: "Error retrieving book data",
        error: error.message,
      });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here

  // const { author } = req.params;

  // const booksArray = Object.values(books);

  // const filter = booksArray.filter((book) => book.author === author);

  // return res.status(200).json({ status: 200, books: filter });
  const { author } = req.params;

  // Usamos el callback para obtener los libros por autor
  getBooksByAuthor(author, (error, books) => {
    if (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Error al obtener libros" });
    }
    return res.status(200).json({ status: 200, books });
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here

  const { title } = req.params;

  // const booksArray = Object.values(books);

  // const filter = booksArray.filter((book) => book.title === title);

  // return res.status(200).json({ status: 200, books: filter });
  getBooksByTitle(title, (error, books) => {
    if (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Error al obtener libros" });
    }
    return res.status(200).json({ status: 200, books });
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;

  const booksArray = Object.values(books);

  const filter = booksArray.filter((book) => book?.isbn === isbn);

  console.log(filter);

  return res.status(200).json({
    status: 200,
    reviews: filter[0]?.reviews ?? {},
  });
});

module.exports.general = public_users;
