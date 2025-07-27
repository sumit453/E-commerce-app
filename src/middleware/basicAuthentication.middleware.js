import UserModel from "../features/user/user.model.js";

const basicAuthentication = (req, res, next) => {
  //check for any authorization
  const authentication = req.headers["authorization"];
  console.log(authentication);

  // if no authorization then
  if (!authentication) {
    return res.status(401).send("No authorization details found");
  }

  //if there is any authorization then get that authorizationCradential
  const base64Cradential = authentication.replace("Basic ", "");
  console.log(base64Cradential);

  // decode that Cradential in this form Cradential are like ("email":"password")
  const decodeCradential = Buffer.from(base64Cradential, "base64").toString(
    "utf8"
  );
  console.log(decodeCradential);

  // slice that Cradential by ':'
  const crad = decodeCradential.split(":");
  console.log(crad);

  // find the user
  const user = UserModel.getAll().find(
    (u) => u.email == crad[0] && u.password == crad[1]
  );
  console.log(user);

  if (user) {
    next();
  } else {
    return res.status(401).send("Incorrect Cradential");
  }
};

export default basicAuthentication;
