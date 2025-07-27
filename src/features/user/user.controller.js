import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepositort from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepositort();
  }
  async signUpController(req, res, next) {
    try {
      //console.log(req.body);
      const { name, email, password, typeOfUser } = req.body;

      const hashPassword = await bcrypt.hash(password, 12);

      const newUser = new UserModel(name, email, hashPassword, typeOfUser);

      await this.userRepository.signup(newUser);

      // dont want to show the ID to the user
      const filteredUser = {
        name: newUser.name,
        email: newUser.email,
        typeOfUser: newUser.typeOfUser,
      };

      return res.status(200).send(filteredUser);
    } catch (err) {
      next(err);
    }
  }

  async signInController(req, res) {
    const { email, password } = req.body;
    try {
      //1. Find user by email
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        return res.status(400).send("Incorect credentials");
      } else {
        //2. compare password with hash password
        const result = await bcrypt.compare(password, user.password);

        if (result) {
          //3. creat a varification tokan
          const tokan = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
          );
          //4. send varification token to user
          return res.status(201).send(tokan);
        } else {
          return res.status(400).send("Incorect credentials");
        }
      }
    } catch (err) {
      return res.status(err.code || 500).send(err.message);
    }
  }

  async resetPasword(req, res) {
    try {
      const newPassword = req.body.newPassword;
      const userId = req.userId;
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.userRepository.changePassword(userId, hashedPassword);
      return res.status(200).send("Password is changed");
    } catch (err) {
      return res.status(err.code || 500).send(err.message);
    }
  }
}
