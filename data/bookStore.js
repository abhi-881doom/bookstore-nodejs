
let nextId = 3;

const books = [
    {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-help",
        year: 2018,
        pages: 320
    },
    {
        id: 2,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        year: 1988,
        pages: 208
    }
];

function getBooks() {
    return books;
}

function addBook(book) {
    const newBook = {
        id: nextId++,
        ...book
    };

    books.push(newBook);
    return newBook;
}

function deleteBook(id) {
    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return false;
    }

    books.splice(index, 1);
    return true;
}

module.exports = {
    getBooks,
    addBook,
    deleteBook
};
