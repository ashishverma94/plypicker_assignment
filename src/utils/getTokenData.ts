import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const encodedToken = request.cookies.get("token")?.value || "";
    if (!encodedToken) {
      throw new Error("Please Login to continue");
    }
    const decodedToken: any = jwt.verify(
      encodedToken,
      process.env.JWT_SECRET_KEY!
    );
    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
