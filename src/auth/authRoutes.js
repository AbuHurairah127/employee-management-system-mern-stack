const express = require("express");
const AuthModal = require("./authModel");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "abuHurairahisagoodboyandheisgonnatobeagooddeveloper";
const authEmployee = require("../middleware/auth");
const authController = require("./authController");

// Creating Employee :Login Required
router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("firstName").isLength({ min: 3 }),
    body("lastName").isLength({ min: 3 }),
    body("userName").isLength({ min: 3 }),
    body("phoneNumber").isLength({ min: 11 }),
  ],
  authController.signUp
);
// Logging In a user with email and password
router.post("/login", [
  body("email", "Enter a valid email address.").isEmail(),
  body("password", "Password can't be blank.").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      let employee = await Employees.findOne({ email });
      if (!employee) {
        return res
          .status(400)
          .json({ error: "Sorry user with this email doesn't exists" });
      }
      const passwordCompare = await bcrypt.compare(password, employee.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Password is incorrect." });
      }
      const data = {
        employee: {
          id: employee.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET_KEY);
      res.json({
        authToken: authToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal server error");
    }
  },
]);
// Fetching Users Data
router.post("/user-data", authEmployee, async (req, res) => {
  try {
    const userId = req.user.id;
    const employee = await Employees.findById(userId).select("-password");
    res.status(200).json({ employee });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;
