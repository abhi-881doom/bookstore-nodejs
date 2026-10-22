
const express = require("express");
const path = require("path");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON requests
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Register book routes
app.use("/api/books", bookRoutes);

// Handle unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found."
    });
});

// Handle unexpected errors
app.use((err, req, res, next) => {
    console.error(err.message);

    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred."
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`BookStore server running at http://localhost:${PORT}`);
});
