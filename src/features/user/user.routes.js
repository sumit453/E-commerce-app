import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middleware/jwtAut.middleware.js";

const userController = new UserController();

const userRoutes = express.Router();

userRoutes.post("/signup", (req, res, next) => {
  userController.signUpController(req, res, next);
});
userRoutes.post("/signin", (req, res) => {
  userController.signInController(req, res);
});
userRoutes.put("/resetPassword", jwtAuth, (req, res) => {
  userController.resetPasword(req, res);
});

export default userRoutes;
