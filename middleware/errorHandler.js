function errorHandler(err, req, res, next) {
  console.error("ERROR STACK:");
  console.error(err.stack);

  const status = err.status || 500;

  res.status(status).render("errors/error", {
    title: status === 404 ? "404 - Not Found" : "500 - Server Error",
    message: process.env.NODE_ENV === "development"
      ? err.message
      : "Something went wrong. Please try again later."
  });
}

module.exports = errorHandler;