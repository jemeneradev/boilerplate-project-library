
const getSuccessGetResponce = (books) => {
    let bookinfo = [];
    books.forEach(element => {
        bookinfo.push({_id:element._id,title:element.title})
    });
    return bookinfo;
}

module.exports = {getSuccessGetResponce:getSuccessGetResponce}