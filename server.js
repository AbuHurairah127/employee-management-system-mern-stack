const connectToMongoDB = require("./db");
const express = require("express");
connectToMongoDB();
const app = express();
const PORT = 5000;
app.use(express.json());
app.use("/employees", require("./src/employees/employeesRoutes"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
