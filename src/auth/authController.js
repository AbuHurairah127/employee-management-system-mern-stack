var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const AuthModel = require("./authModel");
const signUp = async (req, res) => {
  try {
    /* Checking if the request body has any errors. If it does, it will return a 400 status code with the
    errors. */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    /* This is checking if the email address already exists in the database. If it does, it will return a
      400 status code with the message "Sorry a user with this email address already exists." */
    let isEmail = await AuthModel.findOne({ email: req.body.email });
    if (isEmail) {
      return res
        .status(400)
        .json("Sorry a user with this email address already exists.");
    }
    let isUserName = await AuthModel.findOne({ userName: req.body.useName });
    if (isEmail) {
      return res
        .status(400)
        .json("Sorry a user with this email address already exists.");
    }
    const salt = await bcrypt.genSaltSync(10);
    secPass = await bcrypt.hash(req.body.password, salt);
    user = await AuthModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      password: secPass,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
    });
    const data = {
      user: { id: user.id },
    };
    const authToken = jwt.sign(data, JWT_SECRET_KEY);
    res.json({ authToken });
  } catch (error) {
    console.error(error);
    res.status(500).json("Some error occurred");
  }
};
module.exports = {
  signUp,
};
