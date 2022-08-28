const mongoose = require("mongoose");
const { Schema } = mongoose;
const employeesSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Employees", employeesSchema);
