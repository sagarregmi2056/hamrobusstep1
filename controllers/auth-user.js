const User = require("../models/User");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { sendEmail } = require("../helpers");
const { signupValidation, signinValidation } = require("../validator");

exports.signup = async (req, res) => {
  try {
    const { error } = signupValidation.validate(req.body);
    if (error) {
      let responseMessage = "";

      if (error.details[0].path.includes("name")) {
        responseMessage = "Please submit a valid name. ";
      }

      if (error.details[0].path.includes("address")) {
        responseMessage += "Please submit a address. ";
      }

      if (error.details[0].path.includes("email")) {
        responseMessage += "Please submit a valid email. ";
      }

      if (error.details[0].path.includes("phone")) {
        responseMessage += "Please submit a valid 10 digits phone number. ";
      }

      if (error.details[0].path.includes("password")) {
        responseMessage += "Please submit a  6 digits password. ";
      }

      return res.status(400).json({ error: error.details[0].message });
    }

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(403).json({ error: "Email is taken!" });
    }

    // Create a new user
    const newUser = new User(req.body);
    const user = await newUser.save();

    // Removing sensitive information
    user.salt = undefined;
    user.hashed_password = undefined;

    // res.json(user);
    res.json({ message: "User registration successful", userName: user.name });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.signin = async (req, res) => {
  try {
    // Validate the request body against the signin validation schema
    const { error } = signinValidation.validate(req.body);

    // If there's an error in validation, return a validation error response
    if (error) {
      let responseMessage = "";

      if (error.details[0].path.includes("email")) {
        responseMessage = "Please submit a valid email. ";
      }

      if (error.details[0].path.includes("password")) {
        responseMessage = "Please submit a valid password. ";
      }
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "User with that email does not exist.",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    const payload = {
      _id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({ _id: user.id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.signin = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(401).json({
//       error: "User with that email does not exist.",
//     });
//   }

//   if (!user.authenticate(password)) {
//     return res.status(401).json({
//       error: "Email and password do not match",
//     });
//   }

//   const payload = {
//     _id: user.id,
//     name: user.name,
//     email: user.email,
//   };

//   const token = jwt.sign(payload, process.env.JWT_SECRET);

//   // Send both ID and token in the response
//   return res.json({ _id: user.id, token });
// };

exports.userrefreshToken = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res
        .status(400)
        .json({ error: "Invalid content. _id is required." });
    }
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const payload = {
      _id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET /*, { expiresIn: '5m' } */
    );

    return res.json({ _id: user.id, token });
  } catch (error) {
    console.error(error);

    // Handle specific error scenarios
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation Error. Please check your input." });
    }

    // Handle other types of errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.requireUserSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    const founduser = await User.findById(user._id).select("name");

    if (founduser) {
      req.userauth = founduser;
      next();
    } else res.status(401).json({ error: "Not authorized!" });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

exports.checkUserSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    const founduser = await User.findById(user._id).select("name");

    if (founduser) {
      req.userauth = founduser;
    }
  }
  next();
};

function parseToken(token) {
  try {
    return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

exports.isUser = (req, res, next) => {
  let user =
    req.userprofile &&
    req.userauth &&
    req.userprofile._id.toString() === req.userauth._id.toString();
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

exports.refreshToken = async (req, res) => {
  if (req.body && req.body.token) {
    const parsed = parseToken(`Bearer ${req.body.token}`);

    const user = await User.findById(parsed._id);

    const payload = {
      _id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET
      // {expiresIn:"1h"}
    );

    return res.json({ token });
  }
  return res.json({ error: "Invalid content" });
};

exports.socialLogin = async (req, res) => {
  // try signup by finding user with req.email
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    // create a new user and login
    user = new User(req.body);
    req.userprofile = user;
    user.save();
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );
    // return response with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  } else {
    // update existing user with new social info and login
    req.userprofile = user;
    user = _.extend(user, req.body);
    user.save();
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );
    // return response with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  }
};

// // social login ma hamro both facebook ra google use huna sakxa  frontend integrate garyapaxi balla use garni yo
// exports.socialLogin = async (req, res) => {
//   const {
//     name,
//     email,
//     socialPhoto,
//     userID,
//     loginDomain,
//     access_token,
//   } = req.body;

//   if (loginDomain === "facebook") {
//     // for app access_token of facebook
//     // const clientId = ''
//     // const clientSecret = ''
//     // const response = await axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${process.env.FB_CLIENT_ID}&client_secret=${process.env.FB_CLIENT_SECRET}&grant_type=client_credentials`)

//     // const appAccessToken = response.data.access_token
//     const resp = await axios
//       .get(
//         `https://graph.facebook.com/debug_token?input_token=${access_token}
//         &access_token=${process.env.FB_APP_ACCESS_TOKEN}`
//       )
//       .catch((err) => {
//         // console.log(err.response.data, 'dcscsc')
//         return null;
//       });
//     console.log(resp.data);
//     if (!resp || resp.data.data.error || !resp.data.data.is_valid) {
//       return res
//         .status(401)
//         .json({
//           error: resp.data.data.error.message || "Invalid OAuth access token.",
//         });
//     }
//     if (resp.data.data.user_id !== userID) {
//       return res.status(401).json({ error: "Invalid userID." });
//     }
//   }

//   if (loginDomain === "google") {
//     // const clientId = '1071225542864-6lcs1i4re8ht257ee47lrg2jr891518o.apps.googleusercontent.com'
//     const resp = await axios
//       .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${access_token}`)
//       .catch((err) => {
//         // console.log(err.response.data, 'dcscsc')
//         return null;
//       });

//     if (
//       !resp ||
//       resp.data.iss !== "accounts.google.com" ||
//       resp.data.aud !== process.env.GOOGLE_CLIENT_ID
//     ) {
//       return res.status(401).json({ error: "Invalid OAuth access token." });
//     }
//     if (resp.data.sub !== userID) {
//       return res.status(401).json({ error: "Invalid userID" });
//     }
//   }
//   let user = await User.findOne({ userID, loginDomain });
//   if (!user) {
//     // create a new user and login
//     user = new User({ name, email, socialPhoto, userID, loginDomain });
//     user = await user.save();
//     const payload = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//     };
//     const accessToken = jwt.sign(payload, process.env.JWT_SIGNIN_KEY, {
//       expiresIn: process.env.SIGNIN_EXPIRE_TIME,
//     });
//     let refreshToken = {
//       refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
//     };
//     refreshToken = new RefreshToken(refreshToken);
//     await refreshToken.save();
//     // res.setHeader('Set-Cookie', `refreshToken=${refreshToken.refreshToken}; HttpOnly`);
//     return res.json({ accessToken, refreshToken: refreshToken.refreshToken });
//   }

//   if (user.isBlocked) {
//     return res.status(401).json({
//       error: "Your account has been blocked.",
//     });
//   }
//   // update existing user with new social info and login
//   user = _.extend(user, { name, socialPhoto, email });
//   user = await user.save();
//   const payload = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//   };
//   const accessToken = jwt.sign(payload, process.env.JWT_SIGNIN_KEY, {
//     expiresIn: process.env.SIGNIN_EXPIRE_TIME,
//   });
//   let refreshToken = {
//     refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
//   };
//   refreshToken = new RefreshToken(refreshToken);
//   await refreshToken.save();
//   // res.setHeader('Set-Cookie', `refreshToken=${refreshToken.refreshToken}; HttpOnly`);
//   return res.json({ accessToken, refreshToken: refreshToken.refreshToken });
// };

// exports.forgotPassword = async (req, res) => {
//   if (!req.body) return res.status(400).json({ message: "No request body" });
//   if (!req.body.email)
//     return res.status(400).json({ message: "No Email in request body" });

//   const { email } = req.body;
//   // find the user based on email
//   const user = await User.findOne({ email });
//   // if err or no user
//   if (!user)
//     return res.status("401").json({
//       error: "User with that email does not exist!",
//     });

//   // generate a token with user id and secret
//   const token = jwt.sign(
//     { _id: user._id, iss: "NODEAPI" },
//     process.env.JWT_SECRET
//   );

//   // email data
//   const emailData = {
//     from: "sagarregmi2056@gmail.com",
//     to: email,
//     subject: "Password Reset Instructions",

//     // client url baki xa hai
//     text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
//     html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
//   };

//   return user.updateOne({ resetPasswordLink: token }, (err, success) => {
//     if (err) {
//       return res.json({ message: err });
//     } else {
//       sendEmail(emailData);
//       return res.status(200).json({
//         message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
//       });
//     }
//   });
// };

// updated code for the above
exports.forgotPassword = async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No request body" });
  if (!req.body.email)
    return res.status(400).json({
      message: "Please add email of your account which want to be recover",
    });

  const { email } = req.body;

  try {
    // find the user based on email
    const user = await User.findOne({ email });

    // if err or no user
    if (!user)
      return res.status(401).json({
        error: "User with that email does not exist!",
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );

    // email data
    const emailData = {
      from: "sagarregmi2056@gmail.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
    };

    // Update user with resetPasswordLink and send email
    await user.updateOne({ resetPasswordLink: token });

    console.log(emailData);

    // Send email
    sendEmail(emailData);

    return res.status(200).json({
      message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  try {
    let user = await User.findOne({ resetPasswordLink });

    // if err or no user
    if (!user)
      return res.status(401).json({
        error: "Invalid Link!",
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.update = Date.now();

    await user.save();

    res.json({
      message: `Great! Now you can login with your new password.`,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
