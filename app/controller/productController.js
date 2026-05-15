const Product = require("../model/productModel");
const httpCodes = require("../utils/httpCode");
const slugify = require("slugify");

class productController {
  async create(req, res) {
    try {
      let { name, description, price, category, stockQuantity } = req.body;

      name = name?.trim().toLowerCase();
      description = description?.trim();
      category = category?.trim().toLowerCase();

      if (
        !name ||
        !description ||
        price === undefined ||
        !category ||
        stockQuantity === undefined
      ) {
        return res.status(httpCodes.bad_request).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (price < 1 || stockQuantity < 0) {
        return res.status(httpCodes.bad_request).json({
          success: false,
          message: "Price and stock cannot be negetive",
        });
      }

      const slug = slugify(name, {
        lower: true,
        strict: true,
      });

      const existingProduct = await Product.findOne({ slug });

      if (existingProduct) {
        return res.status(httpCodes.conflict).json({
          success: false,
          message: "Product already exist",
        });
      }

      const productData = new Product({
        name,
        slug,
        description,
        price,
        category,
        stockQuantity,
      });

      const data = await productData.save();

      return res.status(httpCodes.created).json({
        success: true,
        message: "Product created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(httpCodes.server_error).json({
        success: false,
        message: error.message,
      });
    }
  }

  async showProducts(req, res) {
    try {
      const data = await Product.find({
        isDeleted: false,
        inStock: true,
      })
        .sort({ createdAt: -1 })
        .lean();

      return res.status(httpCodes.ok).json({
        success: true,
        message: data.length
          ? "Products fetched successfully"
          : "No products available",
        Total_Products: data.length,
        data: data,
      });
    } catch (error) {
      return res.status(httpCodes.server_error).json({
        success: false,
        message: error.message,
      });
    }
  }

  async singleProduct(req, res) {
    try {
      const { slug } = req.params;

      const data = await Product.findOne({
        slug,
        isDeleted: false,
      });

      if (!data) {
        return res.status(httpCodes.not_found).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(httpCodes.ok).json({
        success: true,
        message: "Product Details",
        data: data,
      });
    } catch (error) {
      return res.status(httpCodes.server_error).json({
        success: false,
        message: error.message,
      });
    }
  }

  async stockUpdate(req, res) {
    try {
      const { slug } = req.params;
      const { stockQuantity } = req.body;

      if (stockQuantity === undefined) {
        return res.status(httpCodes.bad_request).json({
          success: false,
          message: "Stock Quantity is required",
        });
      }

      if (stockQuantity < 0) {
        return res.status(httpCodes.bad_request).json({
          success: false,
          message: "Stock quantity can not be negetive",
        });
      }

      const data = await Product.findOneAndUpdate(
        {
          slug,
          isDeleted: false,
        },
        {
          stockQuantity,
          inStock: stockQuantity > 0,
        },
        {
          new: true,
        },
      );

      if (!data) {
        return res.status(httpCodes.not_found).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(httpCodes.ok).json({
        success: true,
        message: "Stock updated successfully",
        data: data,
      });
    } catch (error) {
      return res.status(httpCodes.server_error).json({
        success: false,
        message: error.message,
      });
    }
  }

  async outOfStockProducts(req, res) {
    try {
      const data = await Product.find({
        isDeleted: false,
        inStock: false,
      }).sort({
        createdAt: -1,
      });

      return res.status(httpCodes.ok).json({
        success: true,
        message: data.length
          ? "Products fetched successfully"
          : "All products are inStock",
        Total_Products: data.length,
        data: data,
      });
    } catch (error) {
      return res.status(httpCodes.server_error).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { slug } = req.params;
      const data = req.body;

      if (data.stockQuantity !== undefined) {
        return res.status(httpCodes.bad_request).json({
          success: false,
          message: "Stock update is not allowed here",
        });
      }

      const product = await Product.findOne({ slug, isDeleted: false });

      if (!product) {
        return res.status(httpCodes.not_found).json({
          success: false,
          message: "Product not found",
        });
      }

      if (!product.inStock) {
        return res.status(httpCodes.bad_request).json({
          success: false,
          message: "You cannot update out-of-stock product",
        });
      }

      if (data.name) {
        data.slug = slugify(data.name, {
          lower: true,
          strict: true,
        });
      }

      const updateProduct = await Product.findOneAndUpdate({ slug }, data, {
        new: true,
      });

      return res.status(httpCodes.ok).json({
        success: true,
        message: "Product updated successfully",
        data: updateProduct,
      });
    } catch (error) {
      return res.status(httpCodes.server_error).json({
        success: false,
        message: error.message,
      });
    }
  }

  async softDelete(req, res) {
    try {
      const { slug } = req.params;

      const deleteProduct = await Product.findOneAndUpdate(
        { slug, isDeleted: false },
        { isDeleted: true },
        { new: true },
      );

      if (!deleteProduct) {
        return res.status(httpCodes.not_found).json({
          success: false,
          message: "Product not found or already deleted",
        });
      }

      return res.status(httpCodes.ok).json({
        success: true,
        message: "Product soft deleted successfully",
        data: deleteProduct,
      });
    } catch (error) {
      return res.status(httpCodes.server_error).json({
        success: false,
        message: error.message,
      });
    }
  }

  async hardDelete(req, res) {
    try {
      const { slug } = req.params;

      const deleteProduct = await Product.findOneAndDelete({ slug });

      if (!deleteProduct) {
        return res.status(httpCodes.not_found).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(httpCodes.ok).json({
        success: true,
        message: "Product  deleted from database",
        data: deleteProduct,
      });
    } catch (error) {
      return res.status(httpCodes.server_error).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new productController();
