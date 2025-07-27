import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  likeable: { type: mongoose.Schema.Types.ObjectId, refPath: "on_model" },
  on_model: { type: String, enum: ["Product", "Category"] },
})
  .pre("save", function (next) {
    console.log("New like coming in");
    next();
  })
  .post("save", function (doc) {
    console.log("Like is saved");
    console.log(doc);
  })
  .pre("find", function (next) {
    console.log("Retriving likes");
    next();
  })
  .post("find", function (doc) {
    console.log("Find is completed");
    console.log(doc);
  });

export default likeSchema;
