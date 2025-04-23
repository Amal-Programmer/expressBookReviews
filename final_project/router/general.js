const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    if(isValid(username)){
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


public_users.get('/async', (req,res)=>{
  const getBooks = ()=>{
          return new Promise((resolve, reject)=>{
              resolve(books);
          });
      }
  getBooks().then( response =>{
      res.send(JSON.stringify(response, null, 4));
  })
  .catch((error)=>{
      res.status(500).json({message:"Eroor fetching books"});
  });  
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

 public_users.get('/async/isbn/:isbn', (req, res) => {
  let isbn = req.params.isbn;
  const getBooks = ()=>{
    return new Promise((resolve, reject)=>{
        resolve(books);
    });}
  if(parseInt(isbn)>0 && parseInt(isbn)<11){
    getBooks().then(response =>{
        res.send(response[isbn]);
    })
    .catch(error=>{
        res.status(500).json({message: "Error fetching books"});
    })
    
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
          return res.send(books[i.toString()]);
      }
  }
  res.send(`${author} not found`);
});

public_users.get('/async/author/:author',function (req, res) {
  let author = req.params.author.replace(/[_-]/g, " ").toLowerCase(); //match any underscore or dash
  const getBooks = ()=>{
      return new Promise((resolve, reject)=>{
          resolve(books);
      });}
  getBooks()
  .then(response =>{
      for(let i=1; i<11;i++){
          let author_books = response[i.toString()].author.toLowerCase();
          if(author_books.includes(author)){
              return res.send(response[i.toString()]);
          }
      }
      res.send(`${author} not found`);
  })
  .catch(error=>{ res.status(500).json({message: "Error fetching books"});});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title.replace(/[_-]/g, " ").toLowerCase(); //match any underscore OR dash
  
  for(let i=1; i<11;i++){
      let title_books = books[i.toString()].title.toLowerCase();
      if(title_books.includes(title)){
          return res.send(books[i.toString()]);
      }
  }
  res.send(`Book with title ${title} not found`);
});


// Get all books based on title
public_users.get('/async/title/:title',function (req, res) {
  let title = req.params.title.replace(/[_-]/g, " ").toLowerCase(); //match any underscore or dash
  const getBooks = ()=>{
      return new Promise((resolve, reject)=>{
          resolve(books);
      });}
  getBooks()
  .then(response =>{
      for(let i=1; i<11;i++){
          let title_books = response[i.toString()].title.toLowerCase();
          if(title_books.includes(title)){
             return res.send(response[i.toString()]);
          }
      }
      res.send(`Book with title ${title} not found`);
  })
  .catch(error =>{res.status(500).json({message: "Error fetching books"});
  })
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
