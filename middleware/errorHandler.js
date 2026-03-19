// ============================
// Global Error Handler Middleware
// Catches errors from routes and controllers
// ============================
function errorHandler(err, req, res, next) {
  // Log the full error stack for debugging
  console.error(err.stack);

  // Set status code (default 500 if not provided)
  const status = err.status || 500;

  // Render the error view with proper title and message
  res.status(status).render("errors/error", {
    title: "Error",
    message: err.message
  });
}

module.exports = errorHandler;