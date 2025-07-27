import mongoose from "mongoose";
import likeSchema from "./likes.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";
import userschema from "../user/user.schema.js";

const LikeModel = mongoose.model("Like", likeSchema);
const UserModel = mongoose.model("User", userschema);

export default class LikeRepository {
  async getLike(id, type) {
    try {
      const result = await LikeModel.find({
        likeable: new ObjectId(id),
        on_model: type,
      })
        .populate("user")
        .populate({ path: "likeable", options: { strictPopulate: false } });

      return result;
    } catch (err) {
      console.error("Getlike error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async getLikeFromUser(userId) {
    try {
      const result = await LikeModel.find({
        user: new ObjectId(userId),
      }).populate({ path: "likeable", options: { strictPopulate: false } });
      if (!result) {
        throw new ApplicationError("No like found against this user", 404);
      }
      return result;
    } catch (err) {
      console.error("Get like from user error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async likeProduct(userId, productId) {
    try {
      //is it a coustomer or seller (Only coustomer can like the product)
      const user = await UserModel.findById(new ObjectId(userId));
      if (user.typeOfUser == "Customer") {
        //find if the user is already have a like
        const userLike = await LikeModel.findOne({
          user: new ObjectId(userId),
          likeable: new ObjectId(productId),
        });
        if (!userLike) {
          const like = new LikeModel({
            user: new ObjectId(userId),
            likeable: new ObjectId(productId),
            on_model: "Product",
          });
          await like.save();
          return "Like is added";
        } else {
          return "You already like this product";
        }
      }
      throw new ApplicationError(
        "Seller is not allow to like the product",
        403
      );
    } catch (err) {
      console.error("LikeProduct error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async likeCategory(userId, categoryId) {
    try {
      //is it a coustomer or seller (Only coustomer can like a category)
      const user = await UserModel.findById(new ObjectId(userId));
      if (user.typeOfUser == "Customer") {
        const userLike = await LikeModel.findOne({
          user: new ObjectId(userId),
          likeable: new ObjectId(categoryId),
        });
        if (!userLike) {
          const like = await LikeModel({
            user: new ObjectId(userId),
            likeable: new ObjectId(categoryId),
            on_model: "Category",
          });
          await like.save();
          return "Like is added";
        } else {
          return "You already like this product";
        }
      }
      throw new ApplicationError(
        "Seller is not allow to like the product",
        403
      );
    } catch (err) {
      console.error("LikeCategory error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }
}
