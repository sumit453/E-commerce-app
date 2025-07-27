import { ObjectId } from "mongodb";
import { getDB, getClint } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    // get the clint
    const clint = getClint();
    // creating a session
    const session = clint.startSession();
    try {
      const db = getDB();
      // start a transaction
      session.startTransaction();
      const collection = db.collection(this.collection);

      //1. get cart-items and calculate the total amount of the cart
      const items = await this.getTotalAmount(userId, session);
      //calculate the total amount of the cart
      const totalAmount = items.reduce(
        (acc, currentitem) => acc + currentitem.total_amount,
        0
      );
      console.log(totalAmount);

      //2. create an order record
      const newOrder = new OrderModel(
        new ObjectId(userId),
        totalAmount,
        new Date()
      );
      await collection.insertOne(newOrder, { session });

      //3. Reduce the stock
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      //4. Clear the cart
      await db
        .collection("cart")
        .deleteMany({ userId: new ObjectId(userId) }, { session });

      // commit the session: It mean there is no pending tranjection
      session.commitTransaction();
      // end the session
      session.endSession();
      return;
    } catch (err) {
      // abort the session if there is any error occurs
      await session.abortTransaction();
      // end the session incase of any error occurs
      session.endSession();
      console.log(err.message);
      throw new ApplicationError("Something is wrong with database");
    }
  }

  async getTotalAmount(userId, session) {
    try {
      const db = getDB();
      const collection = db.collection("cart");
      const items = await collection
        .aggregate(
          [
            //1. Get cart-items by matching userId from cart_collection
            { $match: { userId: new ObjectId(userId) } },
            //2. Get products from products_collection by using common data of bothe cart and products collection
            {
              $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id", // Fixed typo: was "forienField"
                as: "product_info",
              },
            },
            //3. unwind all the products
            { $unwind: "$product_info" },
            //4. get total amount of all the products
            {
              $addFields: {
                total_amount: {
                  $multiply: ["$product_info.price", "$quantity"],
                },
              },
            },
          ],
          { session }
        )
        .toArray();

      return items;
    } catch (err) {
      console.log(err.message);
      throw new ApplicationError("Something is wrong with database");
    }
  }
}
