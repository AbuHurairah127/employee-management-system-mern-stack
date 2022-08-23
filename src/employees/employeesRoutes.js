const express = require("express");
const Employees = require("./employeesModal");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.body);
  const employees = Employees(req.body);
  employees.save();
  res.json(req.body);
});
module.exports = router;
