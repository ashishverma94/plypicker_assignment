import userModel from "@/models/user";
import connectDB from "@/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getTokenData";
import productModel from "@/models/products";

connectDB();

export const POST = async (request: NextRequest, res: NextResponse) => {
  try {
    const { newProduct, idProduct } = await request.json();

    if (!idProduct) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product id is invalid or missing",
        }),
        { status: 500 }
      );
    }

    const product: any = await productModel.findById(idProduct);

    if (newProduct.prodName) {
      product.currProduct.prodName = newProduct.prodName;
    }
    if (newProduct.prodDesc) {
      product.currProduct.prodDesc = newProduct.prodDesc;
    }
    if (newProduct.prodDepartment) {
      product.currProduct.prodDepartment = newProduct.prodDepartment;
    }
    if (newProduct.prodPic) {
      product.currProduct.prodPic = newProduct.prodPic;
    }

    await product.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Product request submitted successfully",
        product,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: error.message,
        error,
      }),
      { status: 500 }
    );
  }
};
