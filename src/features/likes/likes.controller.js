import LikeRepository from "./likes.repository.js";

export default class LikesController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }
  async likeItem(req, res) {
    try {
      let result;
      const { id, type } = req.body;
      const userId = req.userId;
      if (!type == "Product" || !type == "Category") {
        return res.status(400).send("Invalid type");
      }
      if (type == "Product") {
        result = await this.likeRepository.likeProduct(userId, id);
      }
      if (type == "Category") {
        result = await this.likeRepository.likeCategory(userId, id);
      }
      return res.status(200).send(result);
    } catch (err) {
      return res.status(err.code || 500).send(err.message);
    }
  }

  async getLikeController(req, res) {
    try {
      const { id, type } = req.query;

      const result = await this.likeRepository.getLike(id, type);
      if (!result) {
        return res.status(404).send("No likes found");
      }

      return res.status(200).send(result);
    } catch (err) {
      return res.status(err.code || 500).send(err.message);
    }
  }

  async getLikeFromUserController(req, res) {
    try {
      const userId = req.userId;
      const result = await this.likeRepository.getLikeFromUser(userId);
      return res.status(result.code || 200).send(result);
    } catch (err) {
      return res.status(err.code || 500).send(err.message);
    }
  }
}
