/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

const tableModify = require('../helpers/tests/tableInit.js');


suite('Functional Tests', function () {
  this.timeout(4000);
  var booksOnDb;
  suiteSetup((done) => {
    tableModify.deleteTable(server, 'api/books', () => {
      tableModify.addToBooks(server, '/api/books', ['Java', 'Go lang', 'Ruby', 'Typescript'], "books added", () => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            booksOnDb = res.body;
            //console.log(booksOnDb);
            done()
          })
      })
    })
  })

  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        //console.log(res.body)
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {

    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        let bookTitle = `Javascript, is it right for you?${Date.now()}`
        chai.request(server)
          .post('/api/books')
          .send({
            title: bookTitle
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            //console.log(res.body)
            assert.isNotArray(res.body, 'response should be an array');
            assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.equal(res.body.commentcount, 0)
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.equal(res.body.title, bookTitle)
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "please provide title");
            done();
          });
      });

      test('Test POST /api/books duplicate', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: "Java"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "book was previously added");
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "return array of books");
            res.body.forEach(book => {
              assert.equal(res.status, 200);
              assert.property(book, 'commentcount')
              assert.property(book, 'title')
              assert.property(book, '_id')
            });
            done();
          });
      });

    });

    suite('GET /api/books/[id] => book object with [id]', function () {

      suiteSetup((done) => {
        //console.log(booksOnDb);
        done()
      })
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/hkhhsswenotinlib')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists")
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        let dbBook = booksOnDb[0];
        var idtolookuo = `/api/books/${dbBook._id}`
        chai.request(server)
          .get(idtolookuo)
          .end((nerr, nres) => {
            //console.log(dbBook,nres.body)
            assert.equal(nres.status, 200);
            assert.equal(dbBook._id, nres.body._id);
            assert.equal(booksOnDb[0].title, nres.body.title);
            assert.equal(booksOnDb[0].commentcount, nres.body.commentcount);
            done()
          });
      });

    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {
      var bookWithComments;
      suiteSetup((done) => {
        bookWithComments = booksOnDb[0];
        tableModify.addToComments(server, `/api/books/${bookWithComments._id}`, [
          "An awesome read",
          "I couldnt recommend it more",
          "This books sucks", "Boring!!"
        ], "comments added", () => {
          console.log(bookWithComments)
          done()
        })
      })
      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .get(`/api/books/${bookWithComments._id}`)
          .end((err, res) => {
            //console.log(res.body)
            assert.equal(res.status, 200);
            res.body.comments.forEach(savedComment => {
              assert.equal(savedComment.bookId,bookWithComments._id)
            });
            done();
          })
      });

    });

  });

});