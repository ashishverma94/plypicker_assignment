import userModel from "@/models/user";
import connectDB from "@/lib/config/db";
import productModel from "@/models/products";
import newProductModel from "@/models/productRequest";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getTokenData";

connectDB();

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { status } = await request.json();
    if (!params.id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product not found to update request",
        }),
        { status: 500 }
      );
    }

    const adminId = await getDataFromToken(request);
    const admin = await userModel.findById(adminId);
    const subProduct = await newProductModel.findById(params.id);
    const orgProduct: any = await productModel.findById(subProduct?.idProduct);
    const subUser = await userModel.findById(subProduct?.idUser);
    if (!subUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Team member data not found",
        }),
        { status: 500 }
      );
    }
    if (!orgProduct) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Original Product not found to update request",
        }),
        { status: 500 }
      );
    }
    if (!subProduct) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Request product detail not found",
        }),
        { status: 500 }
      );
    }
    if (!admin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Admin Detail not found",
        }),
        { status: 500 }
      );
    }

    subProduct.adminName = admin?.name;

    if (admin && admin._id) {
      // @ts-ignore
      subProduct.idAdmin = admin?._id;
    }

    subProduct.status = status

    if (status === "approved") {
      orgProduct.oldProduct = orgProduct?.currProduct;
      if (subProduct.newProduct.prodDepartment) {
        orgProduct.currProduct.prodDepartment =
          subProduct.newProduct.prodDepartment;
      }
      if (subProduct.newProduct.prodName) {
        orgProduct.currProduct.prodName = subProduct.newProduct.prodName;
      }
      if (subProduct.newProduct.prodDesc) {
        orgProduct.currProduct.prodDesc = subProduct.newProduct.prodDesc;
      }
      if (subProduct.newProduct.prodPic) {
        orgProduct.currProduct.prodPic = subProduct.newProduct.prodPic;
      }
      subUser.approvedReq += 1;
      subUser.pendingReq -= 1;
      admin.approvedReq += 1;
    } else {
      subUser.pendingReq -= 1;
      subUser.rejectedReq += 1;
      admin.rejectedReq += 1;
    }

    await subProduct.save();
    await orgProduct.save();
    await subUser.save();
    await admin.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Product request submitted successfully",
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
