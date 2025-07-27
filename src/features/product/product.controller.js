import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { ObjectId } from "mongodb";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }
  async getAllProduct(req, res) {
    try {
      const products = await this.productRepository.getAllProductRepository();
      if (!products) {
        return res.status(404).send("No product is found");
      }
      return res.status(200).send(products);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async addProduct(req, res) {
    try {
      const image = req.file.filename;
      const { name, desc, price, categories, sizes, instock } = req.body;
      const newProduct = new ProductModel(
        name,
        desc,
        parseFloat(price),
        image,
        categories,
        sizes,
        instock
      );
      const userId = req.userId;
      const creatProduct = await this.productRepository.addProductRepository(
        newProduct,
        userId
      );

      return res.status(200).send(creatProduct);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.findOneProduct(
        new ObjectId(id)
      );
      if (product) {
        return res.status(200).send(product);
      } else {
        return res.status(400).send("Product not found");
      }
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async rating(req, res) {
    try {
      const userId = req.userId;
      const productId = req.body.productId;
      const rating = req.body.rating;
      const review = req.body.review;
      await this.productRepository.rateProduct(
        userId,
        productId,
        rating,
        review
      );
      return res.status(200).send("Rating has been added");
    } catch (err) {
      return res.status(err.code).send(err.message);
    }
  }

  async filter(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const result = await this.productRepository.filterProduct(
        minPrice,
        maxPrice,
        category
      );
      if (!result) {
        return res
          .status(400)
          .send("No product found based on the requiredment");
      }
      return res.status(200).send(result);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async averagePrice(req, res) {
    try {
      const result = await this.productRepository.averagePricePerCategory();
      return res.status(200).send(result);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async reviewOfProduct(req, res) {
    try {
      const productId = req.params.id;
      const reviews =
        await this.productRepository.allReviewOfAProduct(productId);
      if (!reviews) {
        return res.status(404).send("There is no any review for this product");
      }
      return res.status(200).send(reviews);
    } catch (err) {
      return res.status(err.code).send(err.message);
    }
  }
  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const userId = req.userId;
      const deleted = await this.productRepository.deleteAProduct(
        productId,
        userId
      );
      if (!deleted) {
        return res.status(404).send("Product is not found");
      }
      return res.status(200).send("Product is deleted");
    } catch (err) {
      return res.status(err.code).send(err.message);
    }
  }

  async deleteReview(req, res) {
    try {
      const productId = req.body.productId;
      const userId = req.userId;
      await this.productRepository.deleteAReview(userId, productId);
      return res.status(200).send("Review is deleted");
    } catch (err) {
      return res.status(err.code).send(err.message);
    }
  }

  async updateReview(req, res) {
    try {
      const productId = req.body.productId;
      const newrating = req.body.newrating;
      const userId = req.userId;
      await this.productRepository.updateAReview(userId, productId, newrating);
      return res.status(200).send("Review is updated");
    } catch (err) {
      return res.status(err.status).send(err.message);
    }
  }

  // trying for "$and" "$or" "$in" operation
  //  async filter(req, res) {
  //   try {
  //     const minPrice = req.query.minPrice;
  //     const category = req.query.category;
  //     const result = await this.productRepository.filterProduct(
  //       minPrice,
  //       category
  //     );
  //     if (!result) {
  //       return res
  //         .status(400)
  //         .send("No product found based on the requiredment");
  //     }
  //     return res.status(200).send(result);
  //   } catch (err) {
  //     return res.status(500).send(err.message);
  //   }
  // }
}
