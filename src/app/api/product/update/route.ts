import userModel from "@/models/user";
import connectDB from "@/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import newProductModel from "@/models/productRequest";
import { getDataFromToken } from "@/utils/getTokenData";

connectDB();

export const POST = async (request: NextRequest, res: NextResponse) => {
  try {
    const { newProduct, idProduct } = await request.json();
    const idUser = await getDataFromToken(request);

    if (!idProduct) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product id is invalid or missing",
        }),
        { status: 500 }
      );
    }

    if (!idUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User id is invalid or missing",
        }),
        { status: 500 }
      );
    }

    const prodRequest = new newProductModel({
      newProduct,
      idUser,
      idProduct,
    });

    await prodRequest.save();
    await userModel.findByIdAndUpdate(idUser, { $inc: { totReq: 1 } });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Product request submitted successfully",
        prodRequest,
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
