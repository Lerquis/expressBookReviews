let books = require("./booksdb.js");

function getbooks(callBack) {
  callBack(null, books);
}

function getBooksByAuthor(author, callback) {
  const booksArray = Object.values(books);
  const filter = booksArray.filter((book) => book.author === author);

  // Llamamos al callback pasando el resultado
  callback(null, filter);
}

function getBooksByTitle(title, callback) {
  const booksArray = Object.values(books);
  const filter = booksArray.filter((book) => book.title === title);

  // Llamamos al callback pasando el resultado
  callback(null, filter);
}

module.exports = {
  getbooks,
  getBooksByAuthor,
  getBooksByTitle,
};
