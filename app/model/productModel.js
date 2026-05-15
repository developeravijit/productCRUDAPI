const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price cannot be less than 1"],
    },

    category: {
      type: String,
      required: true,
      enum: {
        values: ["male", "female", "unisex"],
        message: "Invalid category",
      },
      lowercase: true,
      trim: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    stockQuantity: {
      type: Number,
      default: 0,
      min: [0, "Stock quantity cannot be negative"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
