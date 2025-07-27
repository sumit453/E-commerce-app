import OrderRepository from "./order.repository.js";

export default class OrderController {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async addOrder(req, res) {
    try {
      const userId = req.userId;
      await this.orderRepository.placeOrder(userId);
      return res.status(201).send("Order is placed sucessfully");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
}
