import logger from "./log.js";
import ApplicationError from "../error-handler/applicationError.js";
import mongoose from "mongoose";

// Helper function to log errors consistently
const logError = (err, req) => {
  const isSensitiveUrl =
    req.url.includes("signin") || req.url.includes("signup");
  const timestamp = new Date().toISOString();

  // Always log the original error message
  const errorDetails = {
    message: `ERROR: ${req.method} ${req.url} - ${timestamp} - ${err.message}`,
    stack: err.stack,
    ...(!isSensitiveUrl && { body: req.body || {} }), // using ('...' spread opperation)
  };

  logger.error(errorDetails);
};

const errorHandling = (err, req, res, next) => {
  if (!err) return next(); // Skip if no error

  // Log all errors with original message
  logError(err, req);

  // Handle mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }

  // Handle specific error types
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  // Handle all other errors
  return res.status(503).send("Something went wrong. Please try again later.");
};

export default errorHandling;
