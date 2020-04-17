var chaiHttp = require('chai-http');
var chai = require('chai');

const deleteTable = (server, dburl, next) => {
    chai.request(server)
        .delete(dburl)
        .end((err, res) => {
            console.log("books deleted.")
            next()
        })
}
const addToBooks = (server, dburl ,items,msg="db modified", next) => {
    let limit = 0;
    items.forEach(element => {
        chai.request(server)
            .post(dburl)
            .send({
                title: element
            })
            .end((err, res) => {
                limit++;
                if (limit === items.length) {
                    console.log(msg)
                    next()
                }
            });
    });
}

const addToComments = (server, dburl,items,msg="db modified", next) => {
    let limit = 0;
    items.forEach(element => {
        chai.request(server)
            .post(dburl)
            .send({
                comment: element
            })
            .end((err, res) => {
                limit++;
                if (limit === items.length) {
                    console.log(msg)
                    next()
                }
            });
    });
}

module.exports = {deleteTable:deleteTable,addToBooks:addToBooks,addToComments:addToComments}