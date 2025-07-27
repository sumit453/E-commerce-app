import express from "express";
import CartController from "./cart.controller.js";

const cartRoutes = express.Router();

const cartController = new CartController();

cartRoutes.delete("/:id", (req, res) => {
  cartController.deleteACart(req, res);
});
cartRoutes.post("/", (req, res) => {
  cartController.addCart(req, res);
});
cartRoutes.get("/", (req, res) => {
  cartController.getCart(req, res);
});

export default cartRoutes;
