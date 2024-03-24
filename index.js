require('dotenv').config()
const express = require("express");
const app = express();


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/twitter", (req, res) => {
  res.send("saan");
});

app.get("/login", (req, res) => {
  res.send("login successful");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORTS}`);
});
