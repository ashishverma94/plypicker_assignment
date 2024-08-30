"use client";

import React, { FC } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type props = {
  prodName: string;
  prodDept: string;
  id: string;
};

const PendingRow: FC<props> = ({ prodDept, prodName, id }) => {
  const router = useRouter();
  return (
    <div className=" flex border-b-2">
      <div className=" bg-[white] text-center text-black w-1/3 py-2 flex justify-center font-[500] text-[17px]">
        {prodName}
      </div>
      <div className=" bg-[white] text-center text-black w-1/3 py-2 flex justify-center font-[500] text-[17px]">
        {prodDept}
      </div>
      <div className=" bg-[white] text-center text-black w-1/3 py-2 flex justify-center font-[500] text-[17px]">
        <Button
          onClick={() => router.push(`/pending-requests/${id}`)}
          className="bg-[orange] text-black hover:ring-2 hover:bg-[orange] hover:ring-[#f4b744]"
        >
          View Detail
        </Button>
      </div>
    </div>
  );
};

export default PendingRow;
