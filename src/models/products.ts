import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import mongoose, { Document, Model, Schema } from "mongoose";
import { models } from "mongoose";

export interface IProduct extends Document {
  currProduct: {
    prodName: string;
    prodDesc: string;
    prodDepartment: string;
    prodPic: string;
  };
  oldProduct?: {
    prodName: string;
    prodDesc: string;
    prodDepartment: string;
    prodPic: string;
  };
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    currProduct: {
      prodName: { type: String, required: [true, "Product Name is required"] },
      prodDesc: {
        type: String,
        required: [true, "Product Description is required"],
      },
      prodDepartment: {
        type: String,
        required: [true, "Product Department is required"],
      },
      prodPic: { type: String, required: [true, "Product Pic is required"] },
    },
    oldProduct: {
      prodName: String,
      prodDesc: String,
      prodDepartment: String,
      prodPic: String,
    },
  },
  {
    timestamps: true,
  }
);

const productModel: Model<IProduct> =
  models.Product || mongoose.model("Product", productSchema);

export default productModel;
