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
      prodName: String,
      prodDesc: String,
      prodDepartment: String,
      prodPic: String,
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
