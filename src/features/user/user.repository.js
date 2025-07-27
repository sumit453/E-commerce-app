import mongoose from "mongoose";
import userschema from "./user.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";

//1. creating model
const UserModel = mongoose.model("User", userschema);

export default class UserRepository {
  async signup(user) {
    try {
      //2. creating instence of model
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log(err);
        throw err;
      } else {
        console.log(err.message);
        throw new ApplicationError("Something is wrong with Database", 500);
      }
    }
  }

  async findUserByEmail(email) {
    try {
      // find user by email
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err.message);
      throw new ApplicationError("Something is wrong with Database", 500);
    }
  }

  async changePassword(userId, newPassword) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      const newHashPassword = await bcrypt.hash(newPassword, 12);
      user.password = newHashPassword;
      await user.save();
    } catch (err) {
      console.log(err.message);
      throw new ApplicationError("Something is wrong with Database", 500);
    }
  }
}
