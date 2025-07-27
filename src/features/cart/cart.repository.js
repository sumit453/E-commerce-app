import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

export default class CartRepository {
  constructor() {
    this.controllerName = "cart";
  }

  async addCartItem(newCartItem) {
    try {
      const { userId, productId, quantity } = newCartItem;
      //1. get database
      const db = await getDB();
      //2. find collection
      const collection = db.collection(this.controllerName);
      //3. put cartItem into databse
      await collection.updateOne(
        { userId: userId, productId: productId },
        { $inc: { quantity: quantity } },
        { upsert: true }
      );
      return newCartItem;
    } catch (err) {
      console.log(err.message);
      throw new ApplicationError("Something wrong with database");
    }
  }

  async getCartItems(userId) {
    try {
      //1. get database
      const db = await getDB();
      //2. find collection
      const collection = db.collection(this.controllerName);
      //3. find the cartItems
      return await collection.find({ userId: new ObjectId(userId) }).toArray();
    } catch (err) {
      console.log(err.message);
      throw new ApplicationError("Something wrong with database");
    }
  }

  async deleteCart(userId, cartId) {
    try {
      const db = await getDB();
      //2. find collection
      const collection = db.collection(this.controllerName);
      //3. find the cartItems
      const result = await collection.deleteOne({
        userId: new ObjectId(userId),
        _id: new ObjectId(cartId),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err.message);
      throw new ApplicationError("Something wrong with database");
    }
  }
}
