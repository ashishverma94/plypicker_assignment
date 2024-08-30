import connectDB from "@/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import productModel from "@/models/products";
import { getDataFromToken } from "@/utils/getTokenData";
import newProductModel from "@/models/productRequest";

connectDB();

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
  res: NextResponse
) => {
  try {
    const isLoggedIn = await getDataFromToken(req);
    if (!isLoggedIn) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Please log in to continue",
        }),
        { status: 500 }
      );
    }

    const products = await newProductModel.findById(params.id);
    if (!products) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Original Product not found",
        }),
        { status: 500 }
      );
    }

    const orgProduct = await productModel.findById(products.idProduct);

    return new NextResponse(
      JSON.stringify({
        success: true,
        prodData: {
          orgProduct: orgProduct?.currProduct,
          subProduct: products.newProduct,
          id: params.id,
        },
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
