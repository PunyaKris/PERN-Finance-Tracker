function logger(req, res, next) {
  console.log(`[${req.method}] http://localhost:8000${req.url}`);

  next();
}

export default logger;
