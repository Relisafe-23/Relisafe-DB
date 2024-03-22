// import jwt from "jsonwebtoken";
// import { TOKEN_KEY } from "../config.js";

// export async function verifyToken(req, res, next) {
//   const token = req.body.token || req.query.token || req.headers.token || req.params.token;

//   if (!token) {
//     return res.status(403).send("Token is required for authentication");
//   }
//   try {
//     const verify = jwt.verify(token, TOKEN_KEY);
//     return next();
//   } catch (err) {
//     return res.status(401).send("Token Expired");
//   }
// }

import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../config.js";
import User from "../models/userModel.js";

export async function verifyToken(req, res, next) {
  try {
    // const token = req.body.token || req.query.token || req.headers.token || req.params.token;
    const userId =
    req.body.userId ||
    req.query.userId ||
    req.headers.userId ||
    req.params.userId ||
    req.params.id;
  
      

      const userData = await User.findById(userId);

    // if (!userData) {
    //   return res.status(403).send("User not found");
    // }

    // const token = userData.sessionId;

    // if (!token) {
    //   return res.status(403).send("Token is required for authentication");
    // }

    // const decoded = jwt.verify(token, TOKEN_KEY);

    // const refreshedToken = jwt.sign(
    //   { email: decoded.email, password: decoded.password },
    //   TOKEN_KEY,
    //   {
    //     expiresIn: "30m",
    //   }
    // );
    // const editData = {
    //   sessionId: refreshedToken,
    // };

    // const updateToken = await User.findByIdAndUpdate(userId, editData, {
    //   new: true,
    //   runValidators: true,
    // });

    return next();
  } catch (err) {
    console.log("Error.....", err);
    return res.status(401).send("Token Expired");
  }
}
