const express = require("express");
const Employees = require("./employeesModal");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "abuHurairahisagoodboyandheisgonnatobeagooddeveloper";
// Creating Employee :Login Required
router.post(
  "/create-employee",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      /* Checking if the request body has any errors. If it does, it will return a 400 status code with the
    errors. */
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      /* This is checking if the email address already exists in the database. If it does, it will return a
      400 status code with the message "Sorry a user with this email address already exists." */
      let employee = await Employees.findOne({ email: req.body.email });
      if (employee) {
        return res
          .status(400)
          .json("Sorry a user with this email address already exists.");
      }
      const salt = await bcrypt.genSaltSync(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      employee = await Employees.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        designation: req.body.designation,
      });
      const data = {
        employee: { id: employee.id },
      };
      const authToken = jwt.sign(data, JWT_SECRET_KEY);
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      res.status(500).json("Some error occurred");
    }
  }
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
        success: "User has been logged in successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal server error");
    }
  },
]);

module.exports = router;
