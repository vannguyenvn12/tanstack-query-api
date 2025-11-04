// Middleware to simulate random API errors
// Has a configurable chance (errorRate) to return an error response

export const randomError = (errorRate = 0.1) => {
  // errorRate is a number between 0 and 1 (e.g., 0.1 = 10% chance)
  if (Math.random() < errorRate) {
    const errorMessages = [
      { message: "Server error occurred", status: 500 },
      { message: "Service temporarily unavailable", status: 503 },
      { message: "Network timeout", status: 504 },
      { message: "Internal server error", status: 500 },
      { message: "Bad gateway", status: 502 },
    ];
    const error = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    throw new Error(JSON.stringify(error));
  }
};

// Express middleware for random errors
export const errorMiddleware = (errorRate = 0.05) => {
  return (req, res, next) => {
    try {
      randomError(errorRate);
      next();
    } catch (err) {
      const error = JSON.parse(err.message);
      res.status(error.status).json({
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  };
};

