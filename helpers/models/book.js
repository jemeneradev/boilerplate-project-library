
const getSuccessGetResponse = (books) => {
    let bookinfo = [];
    books.forEach(element => {
        delete element.__v
        //bookinfo.push({_id:element._id,title:element.title})
    });
    return books;
}

module.exports = {getSuccessGetResponse:getSuccessGetResponse}