import winstone from "winston";

const logger = winstone.createLogger({
  level: "info",
  format: winstone.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winstone.transports.File({ filename: "log.txt" })],
});

// Handle logger errors
logger.on("error", (error) => {
  console.error("Logger error:", error);
});

export default logger;
