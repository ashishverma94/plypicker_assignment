import connectDB from "@/lib/config/db";
import { NextResponse } from "next/server";
import productModel from "@/models/products";

connectDB();

export const POST = async (req: Request, res: Response) => {
  try {
    const { currProduct } = await req.json();
    if (!currProduct.prodName) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product name is required",
        }),
        { status: 500 }
      );
    }

    if (!currProduct.prodDepartment) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product Department is required",
        }),
        { status: 500 }
      );
    }

    if (!currProduct.prodPic) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product Pic is required",
        }),
        { status: 500 }
      );
    }

    if (!currProduct.prodDesc) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product Description is required",
        }),
        { status: 500 }
      );
    }

    const product = new productModel({
      currProduct,
    });

    await product.save();
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Product added successfully",
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
