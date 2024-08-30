import connectDB from "@/lib/config/db";
import newProductModel from "@/models/productRequest";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getTokenData";

connectDB();

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const id = await getDataFromToken(req);
    if (!id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Please log in to continue",
        }),
        { status: 500 }
      );
    }

    const userReqs = await newProductModel.find({ idUser: id });

    return new NextResponse(
      JSON.stringify({
        success: true,
        userReqs,
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
