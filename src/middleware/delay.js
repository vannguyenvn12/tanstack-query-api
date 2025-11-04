// Middleware to simulate network delay
// Adds a random delay between minMs and maxMs milliseconds

export const delay = (minMs = 300, maxMs = 800) => {
  const delayTime = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delayTime));
};

// Middleware function for Express
export const delayMiddleware = (minMs = 300, maxMs = 800) => {
  return async (req, res, next) => {
    await delay(minMs, maxMs);
    next();
  };
};

