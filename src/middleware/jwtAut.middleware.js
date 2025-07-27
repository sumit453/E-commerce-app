import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  //1. check the header for token
  const token = req.headers["authorization"];

  //2. if token is not there then return error
  if (!token) {
    return res.status(401).send("Unauthorize");
  }

  //3. check for token validation
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); //useing .env insted of secruit code
    req.userId = payload.userId;
    //console.log(payload);
  } catch (err) {
    //4. if not valid show error
    return res.status(401).send(err);
  }

  //5. if valid run next
  next();
};

export default jwtAuth;
