import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Product is required"],
      ref: "Product",
    },
  ],
});

export default categorySchema;
