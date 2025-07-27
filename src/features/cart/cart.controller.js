import { ObjectId } from "mongodb";
import CartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
  }
  async addCart(req, res) {
    try {
      const productId = req.body.productId;
      const quantity = req.body.quantity;
      const userId = req.userId;
      const newCartItem = new CartModel(
        new ObjectId(productId),
        new ObjectId(userId),
        parseInt(quantity)
      );
      const item = await this.cartRepository.addCartItem(newCartItem);
      return res.status(200).send("Cart is update: " + item);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async getCart(req, res) {
    try {
      const userId = req.userId;
      const result = await this.cartRepository.getCartItems(userId);
      if (result) {
        return res.status(200).send(result);
      }
      return res.status(404).send("No data found");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async deleteACart(req, res) {
    try {
      const userId = req.userId;
      const cartId = req.params.id;
      const deleted = await this.cartRepository.deleteCart(userId, cartId);
      if (!deleted) {
        return res.status(404).send("Item not found");
      }
      return res.status(200).send("Cart is deleted");
    } catch (err) {
      return res.status(404).send(err);
    }
  }
}
