/*
 *
 *
 *       Complete the API routing below
 *       
 *       
 */

'use strict';

var expect = require('chai').expect;
const MONGODB_CONNECTION_STRING = process.env.DB;
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Book = require('../models/book.js')
const BookHelper = require('../helpers/models/book.js')
const Comment = require('../models/comment.js')

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find().exec((err, booksfound) => {
        console.log(booksfound)
        res.json(BookHelper.getSuccessGetResponce(booksfound))
      })
    })

    .post(function (req, res) {
      var title = req.body.title;
      if (title !== undefined) {
        Book.create([{
          title: title
        }], (err, bookCreated) => {
          if (err) {
            console.log(err.stack)
          }
          if (bookCreated === undefined) {
            res.json("book already exists");
          } else {
            console.log("book created:", bookCreated);
            res.json(BookHelper.getSuccessGetResponce(bookCreated))
          }
        })
      } else res.json("please provide name");
      //response will contain new book object including atleast _id and title
    })
    .delete(function(req,res){
      Book.remove((err,books)=>{
        console.log(books)
        res.json("complete delete successful")
      })
    });

  app.route('/api/books/:id')
    .get(function (req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if(bookId === undefined)res.json("unknown book")
      else{
        Book.findOne({_id:bookid},(err,bookFound)=>{
          res.json(bookFound)
        })
      }
    })

    .post(function (req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      if(bookid !== undefined && comment !== undefined){
        Book.exists({_id:bookid},(err,book_exists)=>{
          if(book_exists===true){
            Comment.create({bookId:bookid,text:comment},(err,comment)=>{
              if(comment===null){res.json("comment was not created")}
              else {
                res.json(comment)
              }
            })
          }
        })
      }
      else {
        res.json([])
      }
      //json res format same as .get
    })

    .delete(function (req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      console.log(req.body, req.params)
      if (req.params.id === undefined) res.json("please provide an idea")
      else {
        Book.deleteOne({
          _id: req.params.id
        }, function (err, booksRemoved) {
          console.log(booksRemoved)
          if (booksRemoved===undefined || (booksRemoved!==null && booksRemoved.deletedCount===0)) res.json("book does not exist")
          else res.json("delete successful")
        });
      }
    });

};