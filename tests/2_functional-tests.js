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
    tableModify.deleteTable(server,'api/books',()=>{
      tableModify.addToBooks(server,'/api/books',['Java','Go lang','Ruby','Typescript'],"books added", ()=>{
        chai.request(server)
        .get('/api/books')
        .end((err,res)=>{
          booksOnDb = res.body;
          console.log(booksOnDb);
          done();
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
          chai.request(server)
            .post('/api/books')
            .send({
              title: "TDD: tell me more"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              first_book = res.body[0];
              assert.isNotArray(res.body, 'response should be an array');
              assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
              assert.equal(res.body.commentcount, 0)
              assert.property(res.body, 'title', 'Books in array should contain title');
              assert.equal(res.body.title, "TDD: tell me more")
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
              title: "TDD: tell me more"
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
              assert.property(res.body[0], 'commentcount')
              assert.property(res.body[0], 'title')
              assert.property(res.body[0], '_id')
              done();
            });
        });

      });

      suite('GET /api/books/[id] => book object with [id]', function () {
        var firstBookOnDb;
        suiteSetup((done) => {
          chai.request(server)
            .get('/api/books')
            .end((err, res) => {
              firstBookOnDb = res.body[0];
              done()
            });
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

          var idtolookuo = `/api/books/${firstBookOnDb._id}`
          //console.log(firstBookOnDb,idtolookuo)
          chai.request(server)
            .get(idtolookuo)
            .end((nerr, nres) => {
              //console.log(firstBookOnDb,nres.body)
              assert.equal(nres.status, 200);
              assert.equal(firstBookOnDb._id, nres.body._id);
              assert.equal(firstBookOnDb.title, nres.body.title);
              assert.equal(firstBookOnDb.commentcount, nres.body.commentcount);
              done()
            });
        });

      });

      suite('POST /api/books/[id] => add comment/expect book object with id', function () {
          var firstBookOnDb;

          const addTestComments = (server, bookId, finish) => {
            const comments = ["this book is great", "awesome read!", "Meh, I've read better"];
            let request = 0;
            comments.forEach((element) => {
              chai.request(server)
                .post(`/api/books/${bookId}`)
                .send({
                  comment: element
                })
                .end((err, res) => {
                  request++;
                  if (request === 3) {
                    finish();
                  }
                });
            });
          }

        suiteSetup((done) => {
          chai.request(server)
            .get('/api/books')
            .end((err, res) => {
              firstBookOnDb = res.body[0];
              addTestComments(server,firstBookOnDb._id,done) 
            });
        });
         test('Test POST /api/books/[id] with comment', function (done) {
          //done();
        });

      });

  });

});