
const express = require("express");
const router = express.Router();

const {
    getBooks,
    addBook,
    deleteBook
} = require("../data/bookStore");

const {
    validateBook,
    normalizeBook
} = require("../validators/bookValidator");

// GET: Retrieve all books
router.get("/", (req, res) => {
    const books = getBooks();

    res.status(200).json({
        success: true,
        message: "Books retrieved successfully.",
        count: books.length,
        books
    });
});

// POST: Validate and add a book
router.post("/", (req, res) => {
    const errors = validateBook(req.body);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: "Book was not added. Please correct the errors.",
            errors
        });
    }

    const book = addBook(normalizeBook(req.body));

    return res.status(201).json({
        success: true,
        message: "Book added successfully!",
        book
    });
});

// DELETE: Remove a book by ID
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid book ID."
        });
    }

    if (!deleteBook(id)) {
        return res.status(404).json({
            success: false,
            message: "Book not found."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Book deleted successfully."
    });
});

module.exports = router;
