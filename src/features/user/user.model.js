export default class UserModel {
  constructor(name, email, password, typeOfUser, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.typeOfUser = typeOfUser;
    this._id = id;
  }
}
