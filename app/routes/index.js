const express = require("express");
const productRouter = require("./productRouter");

const router = express.Router();

router.use("/api/product", productRouter);

module.exports = router;
