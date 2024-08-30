"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";

interface IProd {
  prodPic: string ;
  prodName: string | undefined;
  prodDepartment: string | undefined;
  prodDesc: string | undefined;
  id: string;
  setIsPopupOpen: any;
}
interface IUserData {
  approvedReq: number;
  rejectedReq: number;
  _id: string;
  name: string;
  email: string;
  role: string;
  totReq: number;
}

const ProductCard: FC<IProd> = ({
  id,
  prodPic,
  prodName,
  prodDepartment,
  prodDesc,
  setIsPopupOpen,
}) => {
  const router = useRouter();

  return (
    <div className=" h-max-[150px] w-[50%] gap-4 mx-2 bg-[white] shadow-lg rounded-lg  flex-col  flex p-7">
      <div className=" flex gap-4 mx-5  ">
        <Image
          className="h-[200px] w-[200px]  rounded-[20px]"
          src={prodPic}
          width={400}
          height={400}
          alt="Loading Icon"
        />
        <div className="flex flex-col justify-center gap-2">
          <h1 className="font-[800]  text-[28px] ">{prodName}</h1>
          <h1 className="font-[500]  text-[15px] border-[orange] border-[2px] rounded-[20px] px-3 flex justify-center items-center">
            {prodDepartment}
          </h1>
          <div className="  flex justify-center">
            <Button
              onClick={() => setIsPopupOpen(true)}
              className="bg-[#27baeb] rounded-full hover:bg-[#3fc1fe] hover:ring-2 hover:ring-[#38b3ec]"
            >
              Update Product Details
            </Button>
          </div>
        </div>
      </div>
      <div className=" flex justify-center  flex-col">
        <p>{prodDesc}</p>
      </div>
    </div>
  );
};

export default ProductCard;
