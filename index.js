import "./env.js";
import express from "express";
import bodyParser from "body-parser";
import swagger from "swagger-ui-express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import productRoutes from "./src/features/product/product.routes.js";
import userRoutes from "./src/features/user/user.routes.js";
//import basicAuthentication from "./src/middleware/basicAuthentication.middleware.js";
import jwtAuth from "./src/middleware/jwtAut.middleware.js";
import cartRoutes from "./src/features/cart/cart.routes.js";
// import apiDocs from "./swagger2-0.json" with { type: "json" };
import apiDocs from "./swagger3-0.json" with { type: "json" };
import logMiddleware from "./src/middleware/log.middleware.js";
import errorHandling from "./src/middleware/errorHandling.middleware.js";
import { connectToMongodb } from "./src/config/mongodb.js";
import orderRouts from "./src/features/order/order.routes.js";
import ConnectUsingMongoose from "./src/config/mongoose.config.js";
import likesRoutes from "./src/features/likes/likes.routes.js";

const server = express();

server.use(helmet());
server.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// CORS policy configuration

const corsOptions = {
  origin: "http://localhost:5500",
  allowedHeaders: "*",
  methods: "*",
};

server.use(cors(corsOptions));
// server.use((req,res,next) => {
//   res.header("Access-Control-Allow-Origin",'http://localhost:5500')
//   res.header("Access-Control-Allow-Header","*")
//   res.header("Access-Control-Allow-Methods","*")

//   if (req.method == "OPTIONS"){
//     return res.sendStatus(200)
//   }
//   next()
// })

server.use(bodyParser.json());
server.use(express.json());

server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use(logMiddleware);
server.use("/api/cart", jwtAuth, cartRoutes);
server.use("/api/products", jwtAuth, productRoutes);
server.use("/api/users", userRoutes);
server.use("/api/order", jwtAuth, orderRouts);
server.use("/api/like", jwtAuth, likesRoutes);

server.get("/", (req, res) => {
  return res.status(200).send("It is an e-comm project API");
});

// error handling middleware
server.use(errorHandling);

// handling error code 404
server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. Please check our docomentation for more information (http://localhost:3200/api-docs/)"
    );
});

server.listen(3200, () => {
  console.log("Server is listening on 3200");
  //connectToMongodb();
  ConnectUsingMongoose();
});
