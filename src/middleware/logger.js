// Middleware to log all requests with timestamps

export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const query = Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : "";
  const body = req.method !== "GET" && Object.keys(req.body || {}).length > 0 
    ? JSON.stringify(req.body).substring(0, 100) 
    : "";

  console.log(
    `[${timestamp}] ${method} ${url}` +
    (query ? ` Query: ${query}` : "") +
    (body ? ` Body: ${body.substring(0, 100)}...` : "")
  );

  // Log response when it finishes
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    console.log(
      `[${new Date().toISOString()}] ${method} ${url} - ${statusCode} (${duration}ms)`
    );
  });

  next();
};

