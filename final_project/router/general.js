const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
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
}

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    console.log("username " + username);
    console.log("password " + password);

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(400).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(400).json({message: "username and password are required"});
});

async function getBooks() {
  return books;
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
  try {
    const data = await getBooks();
    res.status(200).send(data);
  } catch(error) {
    res.status(500).send("Error processing request");
  }
});

async function getBookByIsbn(isbn) {
  for (const key in books) {
    if (books[key].isbn === isbn) {
      return books[key];
    }
  }
}

async function getBookByAuthor(author) {
  for (const key in books) {
    if (books[key].author === author) {
      return books[key];
    }
  }
}

async function getBookByTitle(title) {
  for (const key in books) {
    if (books[key].title === title) {
      return books[key];
    }
  }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  try {
    const data = await getBookByIsbn(req.params.isbn);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).json({message: "No book for that ISBN"});
    }
  } catch(error) {
    res.status(500).send("Error processing request");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  try {
    const data = await getBookByAuthor(req.params.author);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).json({message: "No book for that author"});
    }
  } catch(error) {
    res.status(500).send("Error processing request");
  }
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  try {
    const data = await getBookByTitle(req.params.title);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).json({message: "No book with that title"});
    }
  } catch(error) {
    res.status(500).send("Error processing request");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if (books[req.params.isbn]) {
    return res.send(books[req.params.isbn].reviews, 200);
  }
  return res.status(404).json({message: "No book with that ISBN"});
});

module.exports.general = public_users;
