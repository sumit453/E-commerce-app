import express from "express";
import OrderController from "./order.controller.js";

const orderRouts = express.Router();

const orderController = new OrderController();

orderRouts.post("/", (req, res) => {
  orderController.addOrder(req, res);
});

export default orderRouts;
