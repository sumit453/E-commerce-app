import mongoose from "mongoose";
import categorySchema from "../features/product/category.schema.js";
import ApplicationError from "../error-handler/applicationError.js";

const ConnectUsingMongoose = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Mongodb using Mongoose is connected");
    // call the function to add some category to the category collection
    addCategory();
  } catch (err) {
    console.log(err.message);
  }
};

// adding some category inside the category collection
async function addCategory() {
  //creating category model
  const CollectionModel = mongoose.model("Category", categorySchema);
  try {
    //check if there is any category is already available
    const categories = await CollectionModel.find();
    //if no category then add some category
    if (!categories || categories.length == 0) {
      await CollectionModel.insertMany([
        { name: "Books" },
        { name: "Electronics" },
        { name: "clothing" },
      ]);
    }
    console.log("categories are added");
  } catch (err) {
    console.error(err.message);
    throw new ApplicationError("Something is wrong with database", 500);
  }
}

export default ConnectUsingMongoose;
