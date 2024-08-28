import connectDB from "@/lib/config/db";
import userModel from "@/lib/models/user";
import { NextResponse } from "next/server";

connectDB();

export const GET = async () => {
  try {
    const users = await userModel.find();
    return NextResponse.json(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};
