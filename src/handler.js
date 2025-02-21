const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid('16');

    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toISOString();

    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    books.push(newBook);
    const response = h.response(
        {
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                "bookId": id
            }
        }
    );
    response.code(201);
    return response;
};

const getAllBooksHandler = () => ({
    status: "success",
    data: {
        books: books.map((book) => (
            {
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }
        )),
    }
});

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, reading, finished } = request.query;
    console.log(books.length);
    console.log(books);

    if (name !== undefined) {
        const result = books.filter((n) => n.name.toLowerCase() === name.toLowerCase());
        return h.response({
            status: "success",
            data: {
                books: result,
            }
        }).code(200);
    }

    if (reading !== undefined) {
        const result = books.filter((n) => {
            if (reading === 0 && n.reading === false) {
                return n;
            }
            if (reading === 1 && n.reading === true) {
                return n;
            }
        });
        return h.response({
            status: "success",
            data: {
                books: result,
            }
        }).code(200);
    }

    if (finished !== undefined) {
        const result = books.filter((n) => {
            if (finished === 0 && n.finished === false) {
                return n;
            }
            if (finished === 1 && n.finished === true) {
                return n;
            }
        });
        return h.response({
            status: "success",
            data: {
                books: result,
            }
        }).code(200);
    }

    // console.log(`requested id : ${bookId}`);
    const book = books.filter((n) => n.id === bookId)[0];
    // console.log(`found book : ${book}`);

    if (book !== undefined) {
        if (books.length === 0) {
            const response = h.response({
                status: "success",
                data: {
                    book: []
                }
            });
            response.code(200);
            return response;
        }
        const response = h.response({
            status: 'success',
            data: {
                book: book,
            }
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
        book: [],
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    console.log('edit:');
    console.log(`readPage : ${readPage}, pageCount : ${pageCount}`);
    console.log(`requested id : ${bookId}`);
    console.log(`name : ${name}`);

    const index = books.findIndex((book) => book.id === bookId);

    console.log(`index found : ${index}`);

    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }

    if (index === -1) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        });
        response.code(404);
        return response;
    };

    const updatedAt = new Date().toISOString();

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
    };

    const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
    });

    response.code(200);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    // console.log(`delete:`);
    console.log(`book to be deleted: ${index}`);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus"
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan"
    });

    response.code(404);
    return response;
};

module.exports = ({
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
});