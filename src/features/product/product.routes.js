import express from "express";
import ProductController from "./product.controller.js";
import uploadFile from "../../middleware/fileupload.middleware.js";

const productRoutes = express.Router();

const productController = new ProductController();

productRoutes.get("/filter", (req, res) => {
  productController.filter(req, res);
});

productRoutes.get("/averagePrice", (req, res) => {
  productController.averagePrice(req, res);
});

productRoutes.delete("/deletereview", (req, res) => {
  productController.deleteReview(req, res);
});

productRoutes.get("/:_id/reviews", (req, res) => {
  productController.reviewOfProduct(req, res);
});

productRoutes.delete("/:_id", (req, res) => {
  productController.deleteProduct(req, res);
});

productRoutes.get("/:_id", (req, res) => {
  productController.getOneProduct(req, res);
});

productRoutes.get("/", (req, res) => {
  productController.getAllProduct(req, res);
});

productRoutes.post("/rate", (req, res) => {
  productController.rating(req, res);
});

productRoutes.post("/", uploadFile.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});

productRoutes.patch("/updatereview", (req, res) => {
  productController.updateReview(req, res);
});

export default productRoutes;
