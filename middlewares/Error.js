exports.ErrorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || err._message ? 401 : 500;
    let message = err._message || err.message || "Internal server error";
  
    if (err.name === "ValidationError") {
      // Handling MongoDB validation errors
      statusCode = 422; // Unprocessable Entity
      const validationErrors = Object.values(err.errors).map((error) => error.message);
      message = validationErrors[0] || "Validation error";
      res.status(statusCode).json({
        success: false,
        message,
        errors: validationErrors,
      });
    } else {
      // Handling other errors
      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  };
  