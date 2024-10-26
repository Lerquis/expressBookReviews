const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res
      .status(200)
      .json({ status: 200, message: "User successfully logged in" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const { isbn } = req.params;

  const { review } = req.body;

  if (!review)
    return res.status(200).json({ status: 400, message: "Review is missing" });

  const booksArray = Object.values(books);

  let indexKey;

  const filter = booksArray.filter((book, i) => {
    if (book?.isbn === isbn) {
      indexKey = i;
      return book;
    }
  })[0];

  if (!filter)
    return res
      .status(200)
      .json({ status: 400, message: `There is no book with ${isbn}` });

  books[indexKey + 1].reviews = {
    ...books[indexKey + 1].reviews,
    [req.session.authorization.accessToken]: review,
  };

  return res.status(300).json({ status: 200, message: "Review Added", books });
});

regd_users.delete("/auth/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  const booksArray = Object.values(books);

  let indexKey;

  const filter = booksArray.filter((book, i) => {
    if (book?.isbn === isbn) {
      indexKey = i;
      return book;
    }
  })[0];

  if (!filter)
    return res
      .status(200)
      .json({ status: 400, message: `There is no book with ${isbn}` });

  delete books[indexKey + 1].reviews[req.session.authorization.accessToken];

  return res
    .status(300)
    .json({ status: 200, message: "Review Deleted", books });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
