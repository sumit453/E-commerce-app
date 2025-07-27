import mongoose from "mongoose";
import productSchema from "./product.schema.js";
import ratingSchema from "./rating.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";
import categorySchema from "./category.schema.js";
import { ObjectId } from "mongodb";
import userschema from "../user/user.schema.js";

// creating Product model
const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", ratingSchema);
const CategoryModel = mongoose.model("category", categorySchema);
const UserModel = mongoose.model("User", userschema);

export default class ProductRepository {
  async addProductRepository(productdata, userId) {
    try {
      //find the user by userId
      const user = await UserModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      if (user.typeOfUser == "Seller") {
        // split the category id by ","
        if (productdata.category) {
          productdata.categories = productdata.category
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e)
            .map((id) => {
              if (!mongoose.isValidObjectId(id)) {
                throw new ApplicationError(`Invalid category ID: ${id}`, 402);
              }
              return new mongoose.Types.ObjectId(id);
            });
        } else {
          productdata.categories = [];
        }

        // split the size by ","
        if (productdata.size) {
          productdata.sizes = productdata.size
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e);
        } else {
          productdata.sizes = [];
        }
        const newProduct = new ProductModel(productdata);
        const savedProduct = await newProduct.save();
        await CategoryModel.updateMany(
          { _id: { $in: savedProduct.categories } },
          { $push: { products: new ObjectId(savedProduct._id) } }
        );
        return savedProduct;
      }
      throw new ApplicationError("Only seller can add product", 403);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        console.error("Mongoose erro is for addProduct is: ", err.message);
        throw err;
      } else {
        console.error("AddProduct error is: ", err.message);
        throw new ApplicationError("Something is wrong with database", 500);
      }
    }
  }

  async getAllProductRepository() {
    try {
      return await ProductModel.find();
    } catch (err) {
      console.error("GetAllProduct error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async findOneProduct(id) {
    try {
      return await ProductModel.findById(id);
    } catch (err) {
      console.error("GetOne product error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async rateProduct(userId, productId, rating, review) {
    try {
      const user = await UserModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      if (user.typeOfUser == "Customer") {
        // find the product by it's id
        const product = await ProductModel.findById(productId);
        if (!product) {
          throw new ApplicationError("Product is not found");
        }
        // find rating is exist or not
        const userReview = await ReviewModel.findOne({
          product: new ObjectId(productId),
          user: new ObjectId(userId),
        });
        if (userReview) {
          userReview.rating = rating;
          userReview.review = review;
          await userReview.save();
        }
        const newReview = new ReviewModel({
          product: new ObjectId(productId),
          user: new ObjectId(userId),
          rating: rating,
          review: review,
        });
        await newReview.save();
        product.reviews.push(newReview._id);
        await product.save();
      }
      throw new ApplicationError("Only Customer can review a product", 403);
    } catch (err) {
      console.error("rating Error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async filterProduct(minPrice, maxPrice, category) {
    try {
      const filterInstence = {};
      if (minPrice !== undefined || maxPrice !== undefined) {
        filterInstence.price = {};
        if (minPrice) {
          filterInstence.price.$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          filterInstence.price.$lte = parseFloat(maxPrice);
        }
      }
      if (category) {
        filterInstence.category = category;
      }

      return await ProductModel.find(filterInstence);
    } catch (err) {
      console.error("Filter Error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async averagePricePerCategory() {
    try {
      return await ProductModel.aggregate([
        {
          $group: {
            _id: "$category",
            averagePrice: { $avg: "$price" },
          },
        },
      ]);
    } catch (err) {
      console.error("Average price error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async allReviewOfAProduct(productId) {
    try {
      return await ReviewModel.find({ product: new ObjectId(productId) });
    } catch (err) {
      console.error("Product review error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async deleteAProduct(productId, userId) {
    try {
      //find the user
      const user = await UserModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      if (user.typeOfUser == "Seller") {
        const result = await ProductModel.deleteOne({
          _id: new ObjectId(productId),
        });
        return result.deletedCount > 0;
      } else {
        throw new ApplicationError("Only seller can delete a product", 403);
      }
    } catch (err) {
      console.error("Delete error is: ", err.message);
      throw new ApplicationError("Something is wrong with databse", 500);
    }
  }

  async deleteAReview(userId, productId) {
    try {
      const user = await UserModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      if (user.typeOfUser == "Customer") {
        await ReviewModel.deleteOne({
          product: new ObjectId(productId),
          user: new ObjectId(userId),
        });
      }
      throw new ApplicationError(
        "You are not allower to delete this review",
        403
      );
    } catch (err) {
      console.error("Delete review error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async updateAReview(userId, productId, newRating) {
    try {
      const user = await UserModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      if (user.typeOfUser == "Customer") {
        const review = await ReviewModel.findOne({
          product: new ObjectId(productId),
          user: new ObjectId(userId),
        });
        review.rating = newRating;
        await review.save();
      }
      throw new ApplicationError(
        "You are not allowed to update the review",
        403
      );
    } catch (err) {
      console.error("Update review error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }
}
