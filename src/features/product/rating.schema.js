import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Product is required"],
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User is required"],
    ref: "User",
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating can not be less then 1"],
    max: [5, "Rating can not be greater then 5"],
  },
  date:{},
  review: { type: String, maxLength: [500] },
});

export default ratingSchema;
