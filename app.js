const express = require("express");
const employeeRouter = require("./routes/employeesRoutes");

const app = express();

app.use(express.json());
app.use("/api/employees", employeeRouter);

module.exports = app;
