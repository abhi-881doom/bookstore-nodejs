
function validateBook(data) {
    const errors = {};

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return {
            request: "Please send valid book data."
        };
    }

    const title =
        typeof data.title === "string" ? data.title.trim() : "";

    const author =
        typeof data.author === "string" ? data.author.trim() : "";

    const genre =
        typeof data.genre === "string" ? data.genre.trim() : "";

    const year = data.year;
    const pages = data.pages;

    // Validate title
    if (!title) {
        errors.title = "Book title is required.";
    } else if (title.length < 2 || title.length > 100) {
        errors.title = "Title must contain 2 to 100 characters.";
    }

    // Validate author
    if (!author) {
        errors.author = "Author name is required.";
    } else if (author.length < 2 || author.length > 80) {
        errors.author = "Author must contain 2 to 80 characters.";
    }

    // Validate genre
    if (!genre) {
        errors.genre = "Please enter a genre.";
    } else if (genre.length > 40) {
        errors.genre = "Genre cannot exceed 40 characters.";
    }

    // Validate publication year
    const currentYear = new Date().getFullYear();

    if (
        year === undefined ||
        year === null ||
        year === "" ||
        !Number.isInteger(Number(year)) ||
        Number(year) < 1450 ||
        Number(year) > currentYear
    ) {
        errors.year =
            `Enter a whole year from 1450 to ${currentYear}.`;
    }

    // Validate page count
    if (
        pages === undefined ||
        pages === null ||
        pages === "" ||
        !Number.isInteger(Number(pages)) ||
        Number(pages) < 1 ||
        Number(pages) > 50000
    ) {
        errors.pages =
            "Pages must be a whole number from 1 to 50000.";
    }

    return errors;
}

function normalizeBook(data) {
    return {
        title: data.title.trim(),
        author: data.author.trim(),
        genre: data.genre.trim(),
        year: Number(data.year),
        pages: Number(data.pages)
    };
}

module.exports = {
    validateBook,
    normalizeBook
};
