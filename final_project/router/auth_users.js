const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let username_exist = users.filter(user => user.username === username);
return username_exist.length>0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const exists = users.filter(user=> user.username === username && user.password === password);
return exists.length>0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    res.status(404).json({message: "Error logging in"});
  }
  if(authenticatedUser(username,password )){
    let accessToken = jwt.sign(
      { data: password },
      "fingerprint_customer",
      {expiresIn: 60*60});
    req.session.authorization = {accessToken, username};
    res.status(200).send("User successfully logged in");
  }else{
    res.status(208).json({message: "Invalid login, check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.user.username;
  
  if(review && isbn >0 && isbn <11){
    books[isbn].reviews = `Reviw by ${username} : ${review} `;
    res.status(200).json({message: "Review submitted successfully"});
  }else{
    res.status(404).json({message: "Check isbn code and review"});
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
