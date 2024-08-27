import { NextResponse } from "next/server";
import connectDB from "@/app/lib/config/db";
import userModel from "@/app/lib/models/user";

export const GET = async () => {
  try {
    await connectDB();
    const users = await userModel.find();
    return NextResponse.json(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};
