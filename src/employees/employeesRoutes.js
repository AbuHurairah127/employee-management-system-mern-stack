const express = require("express");
const Employees = require("./employeesModal");
const router = express.Router();
const { body, validationResult } = require("express-validator");
router.post(
  "/",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  (req, res) => {
    /* This is a middleware function that checks if the request body is valid or not. If it is not
    valid, it returns a 400 status code with the errors. If it is valid, it creates a new employee
    and returns the employee object. */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let employee = await Employees.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      designation: req.body.designation,
    });
  }
);
module.exports = router;
