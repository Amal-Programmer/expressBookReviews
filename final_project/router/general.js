const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    let username_exist = users.filter(user => user.username === username);
    if(!username_exist){
      users.push({"username":username, "password":password});
      res.status(200).json({message: "User registered successfully"});
    }else{
      res.status(404).json({message:"Username already exists"});
    }
  }else{
    res.status(404).json({message:"Unable to register user"});
  }
});



public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  res.send(username);
  if(username && password){
    let username_exist = users.filter(user => user.username === username);
    if(username_exist.length>0){
        res.status(404).json({message:"Username already exists"});
     
    }else{
        users.push({"username":username, "password":password});
        res.status(200).json({message: "User registered successfully"});
    }
  }else{
    res.status(404).json({message:"Unable to register user"});
  }
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(parseInt(isbn)>0 && parseInt(isbn)<11){
    res.send(books[isbn]);
  }else{
    res.send("Wrong isbn");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author.replace(/[_-]/g, " ").toLowerCase(); //match any underscore OR dash
  for(let i=1; i<11;i++){
      let author_books = books[i.toString()].author.toLowerCase();
      if(author_books.includes(author)){
          res.send(books[i.toString()]);
      }
  }
  res.send(`${author} not found`);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title.replace(/[_-]/g, " ").toLowerCase(); //match any underscore OR dash
  
  for(let i=1; i<11;i++){
      let title_books = books[i.toString()].title.toLowerCase();
      if(title_books.includes(title)){
          res.send(books[i.toString()]);
      }
  }
  res.send(`Book with title ${title} not found`);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(parseInt(isbn)>0 && parseInt(isbn)<11){
    res.send(books[isbn].reviews);
  }else{
    res.send("Wrong isbn");
  }
});

module.exports.general = public_users;
