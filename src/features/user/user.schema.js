import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [25, "Name can not be greater then 25 characters"],
  },
  email: {
    type: String,
    unique: [true, "This email is already listed"],
    required: [true, "Email is required"],
    match: [/.+\@.+\../, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (value) {
        return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
      },
      message:
        "Password should be between 8-12 charachetrs and have a special character",
    },
  },
  typeOfUser: {
    type: String,
    enum: ["Customer", "Seller"],
    required: [true, "Type of user is required"],
  },
});

export default userschema;
