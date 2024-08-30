import connectDB from "@/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import productModel from "@/models/products";
import { getDataFromToken } from "@/utils/getTokenData";
import { useRouter } from "next/router";

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

    const product = await productModel.findById(params.id);

    return new NextResponse(
      JSON.stringify({
        success: true,
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
