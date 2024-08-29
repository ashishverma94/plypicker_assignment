"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface IProd {
  prodPic: string;
  prodName: string;
  prodDepartment: string;
  prodDesc: string;
  id: string;
}
const ProductRow: FC<IProd> = ({
  id,
  prodPic,
  prodName,
  prodDepartment,
  prodDesc,
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/product/${id}`)}
      className=" cursor-pointer h-max-[150px] gap-4 mx-2 bg-[white] shadow-lg rounded-lg md:mx-[100px] flex-col md:flex-row  lg:mx-[300px] flex p-4"
    >
      <div className="md:w-[13%]  h-full flex justify-center items-center">
        <Image
          className="h-[100px] w-[100px] bg-[red] rounded-[20px]"
          src={prodPic}
          width={400}
          height={400}
          alt="Loading Icon"
        />
      </div>
      <div className="w-[86%] flex justify-center  flex-col">
        <div className="flex justify-between">
          <h1 className="font-[700]  text-[18px] ">{prodName}</h1>
          <h1 className="font-[500]  text-[13px] bg-[orange] rounded-[20px] px-3 flex justify-center items-center">
            {prodDepartment}
          </h1>
        </div>
        <p>
          {prodDesc.slice(0, 200)}
          {prodDesc.length > 200 && "..."}
        </p>
      </div>
    </div>
  );
};

export default ProductRow;
