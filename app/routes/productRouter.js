const express = require("express");
const productController = require("../controller/productController");

const productRouter = express.Router();

productRouter.post("/create", productController.create);

productRouter.get("/all-products", productController.showProducts);

productRouter.get("/single-product/:slug", productController.singleProduct);

productRouter.patch("/update-stock/:slug", productController.stockUpdate);

productRouter.get("/out-of-stock", productController.outOfStockProducts);

productRouter.put("/update/:slug", productController.updateProduct);

productRouter.delete("/soft-delete/:slug", productController.softDelete);

productRouter.get("/deleted-products", productController.showDeletedProduct);

productRouter.patch(
  "recover-product/:slug",
  productController.recoverDeletedProduct,
);

productRouter.delete("/hard-delete/:slug", productController.hardDelete);

module.exports = productRouter;
