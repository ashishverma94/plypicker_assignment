"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const page = () => {
  const router = useRouter();
  return (
    <div className="h-[90vh] mt-[70px] w-full justify-center items-center flex-col  flex font-[1000] text-[45px]">
      <div className="empty_text">Access Denied !</div>
      <Button
        onClick={() => router.push("/dashboard")}
        className="text-[white] text-[17px] font-[400] my-2 bg-[orange] hover:bg-[#be8e34] hover:ring-2 hover:ring-[#orange] "
      >
        Go to Dashboard
      </Button>
    </div>
  );
};

export default page;
