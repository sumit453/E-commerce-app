// import fs from "fs";

// const fsPromise = fs.promises;

// async function log(logData) {
//   try {
//     logData = `\n ${new Date().toString()} - ${logData}`;
//     await fsPromise.appendFile("log.txt", logData);
//   } catch (err) {
//     console.log(err);
//   }
// }

// const logMiddleware = async (req, res, next) => {
//   if (!req.url.includes("signin")) {
//     const logData = `${req.url} - ${JSON.stringify(req.body)}`;
//     await log(logData);
//   }
//   next();
// };

// export default logMiddleware;

// using winstone library

import logger from "./log.js";

const loggerMiddleware = (req, res, next) => {
  const sensitiveURL = req.url.includes("signin") || req.url.includes("signup");
  logger.info({
    url: req.url,
    timestamp: new Date().toString(),
    ...(!sensitiveURL && { body: req.body || {} }), // using ("..." spread operator)
  });
  next();
};

export default loggerMiddleware;
