import connectDB from "@/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import productModel from "@/models/products";
import { getDataFromToken } from "@/utils/getTokenData";

connectDB();

export const GET = async (req: NextRequest, res: NextResponse) => {
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
    const products = await productModel.find();

    return new NextResponse(
      JSON.stringify({
        success: true,
        products,
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
