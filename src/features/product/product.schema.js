import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  desc: {
    type: String,
    required: [
      true,
      "Giveing a description about the product is usefull for coustomer",
    ],
  },
  price: { type: Number, required: [true, "Price is required"] },

  instock: {
    type: Number,
    required: [true, "It is importent to update about the stock"],
  },
  imageUrl: { type: String, required: [true, "Image is required"] },
  sizes: [{ type: String }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  ],
});

export default productSchema;
