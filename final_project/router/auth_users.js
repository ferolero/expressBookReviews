const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "You must provide username and password" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(400).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const userIsbn = req.params.isbn;
    if (books[userIsbn]) {
        let bookToReview = books[userIsbn];
        bookToReview.reviews[req.session.authorization.username] = req.query.review;
        return res.status(200).send("Updated review for book: " + bookToReview.title);
    }
    return res.status(404).json({ message: "There is no book with that ISBN" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const userIsbn = req.params.isbn;
    if (books[userIsbn]) {
        let bookToUpdate = books[userIsbn];
        delete bookToUpdate.reviews[req.session.authorization.username];
        return res.status(200).send("Removed review from book: " + bookToUpdate.title);
    }
    return res.status(404).json({ message: "There is no book with that ISBN" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
