
const form = document.getElementById("bookForm");
const message = document.getElementById("message");
const bookList = document.getElementById("bookList");
const bookCount = document.getElementById("bookCount");
const submitButton = form.querySelector("button[type='submit']");

const fields = ["title", "author", "genre", "year", "pages"];

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    message.hidden = false;
}

function clearErrors() {
    fields.forEach(field => {
        document.getElementById(`${field}Error`).textContent = "";
        document.getElementById(field).classList.remove("invalid");
    });
}

function showErrors(errors) {
    clearErrors();

    fields.forEach(field => {
        if (errors[field]) {
            document.getElementById(`${field}Error`).textContent =
                errors[field];

            document.getElementById(field).classList.add("invalid");
        }
    });
}

async function loadBooks() {
    try {
        const response = await fetch("/api/books");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Could not load books.");
        }

        displayBooks(result.books);
    } catch (error) {
        bookCount.textContent = "Unable to load books.";
        bookList.textContent =
            "Please check the server connection and refresh.";
    }
}

function displayBooks(books) {
    bookCount.textContent =
        `${books.length} ${books.length === 1 ? "book" : "books"} in your library`;

    bookList.replaceChildren();

    if (books.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "No books yet. Add your first book above!";
        bookList.appendChild(empty);
        return;
    }

    books.forEach(book => {
        const card = document.createElement("article");
        card.className = "book-card";

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = `By ${book.author}`;

        const genre = document.createElement("p");
        genre.textContent = `Genre: ${book.genre}`;

        const meta = document.createElement("p");
        meta.className = "book-meta";
        meta.textContent = `${book.year} · ${book.pages} pages`;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete Book";

        deleteButton.addEventListener("click", () => {
            deleteBook(book.id);
        });

        card.append(title, author, genre, meta, deleteButton);
        bookList.appendChild(card);
    });
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    clearErrors();
    message.hidden = true;
    submitButton.disabled = true;

    const data = Object.fromEntries(
        new FormData(form).entries()
    );

    try {
        const response = await fetch("/api/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            showErrors(result.errors || {});
            showMessage(
                result.message || "Please check your input.",
                "error"
            );
            return;
        }

        form.reset();
        await loadBooks();
        showMessage(result.message, "success");
    } catch (error) {
        showMessage(
            "Could not contact the server. Please try again.",
            "error"
        );
    } finally {
        submitButton.disabled = false;
    }
});

async function deleteBook(id) {
    const confirmed = window.confirm(
        "Do you want to delete this book?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/api/books/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            showMessage(result.message, "error");
            return;
        }

        await loadBooks();
        showMessage(result.message, "success");
    } catch (error) {
        showMessage("Unable to contact the server.", "error");
    }
}

// Display the initial book list
loadBooks();
