require("dotenv").config();
const express = require("express");
const DbConnect = require("./app/config/db");
const router = require("./app/routes");

const app = express();

DbConnect();

// Json Config
app.use(express.json());

// Define Router
app.use(router);

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
  console.log(`Port is running on ${PORT}`);
});
