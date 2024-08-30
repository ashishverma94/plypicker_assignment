import mongoose, { Document, Model, Schema } from "mongoose";
import { models } from "mongoose";

export interface INewProduct extends Document {
  newProduct: {
    prodName?: string;
    prodDesc?: string;
    prodDepartment?: string;
    prodPic?: string;
  };
  status?: String;
  idUser?: String;
  idAdmin?: String;
  idProduct?: String;
  adminName?: String;
}

const newProductSchema: Schema<INewProduct> = new mongoose.Schema(
  {
    newProduct: {
      prodName: String,
      prodDesc: String,
      prodDepartment: String,
      prodPic: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    idUser: String,
    idAdmin: String,
    idProduct: String,
    adminName: String,
  },
  {
    timestamps: true,
  }
);

const newProductModel: Model<INewProduct> =
  models.NewProduct || mongoose.model("NewProduct", newProductSchema);

export default newProductModel;
