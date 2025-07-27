import express from "express";
import LikesController from "./likes.controller.js";

const likesRoutes = express.Router();
const likeController = new LikesController();

likesRoutes.post("/", (req, res) => {
  likeController.likeItem(req, res);
});

likesRoutes.get("/", (req, res) => {
  likeController.getLikeController(req, res);
});

likesRoutes.get("/userlike", (req, res) => {
  likeController.getLikeFromUserController(req, res);
});

export default likesRoutes;
