"use client";

import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import LoadingGif from "../../../../assets/Loading2.gif";
import { MergePordPopup } from "@/components";

interface IProdData {
  orgProduct: {
    prodName: string;
    prodDepartment: string;
    prodPic: string;
    prodDesc: string;
  };
  subProduct: {
    prodName: string;
    prodDepartment: string;
    prodPic: string;
    prodDesc: string;
  };
  id:string;
}

const page = () => {
  const { id }: { id: string } = useParams();
  const [pendReq, setPenReq] = useState<IProdData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>("");
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setLoadingData(true);
        const response = await axios.get(`/api/product/change-data/${id}`);
        setPenReq(response?.data?.prodData);
      } catch (err: any) {
        if (err.response) {
          setError(err?.response.data.message || "An error occurred");
        } else {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  if (!pendReq) {
    return;
  }

  console.log(pendReq)

  // HANDLE UPDATE REQUEST

  return (
    <div className="mt-[80px] pb-[30px] flex items-center flex-col bg-[#edecec] h-min-[90vh]">
      {error && (
        <div className="text-[red] text-[20px] font-[500]">
          {error && error}
        </div>
      )}
      {loadingData ? (
        <div className=" flex justify-center items-center w-full h-[full]">
          <Image
            className="h-[130px] w-[130px]"
            src={LoadingGif}
            width={400}
            height={400}
            alt="Loading Icon"
          />
        </div>
      ) : (
        <div className=" flex flex-col md:flex-row gap-7 p-5">
          <div className="w-[100%] md:w-[50%] flex flex-col justify-center items-center ">
            <h1 className="font-[700] text-[25px] mb-5 ">Original Product</h1>
            <div className=" h-[450px] gap-4 mx-2 bg-[white] shadow-lg rounded-lg  flex-col   flex p-7">
              <div className=" flex gap-4 mx-5  ">
                <Image
                  className="h-[200px] w-[200px] bg-[red] rounded-[20px]"
                  src={pendReq?.orgProduct.prodPic}
                  width={400}
                  height={400}
                  alt="Loading Icon"
                />
                <div className="flex flex-col justify-center gap-2">
                  <h1 className="font-[800]  text-[28px] ">
                    {pendReq.orgProduct.prodName}
                  </h1>
                  <h1 className="font-[500]  text-[15px] border-[orange] border-[2px] rounded-[20px] px-3 flex justify-center items-center">
                    {pendReq?.orgProduct.prodDepartment}
                  </h1>
                </div>
              </div>
              <div className="">
                <p>{pendReq?.orgProduct.prodDesc}</p>
              </div>
            </div>
          </div>
          <div className="w-[100%] md:w-[50%] flex flex-col justify-center items-center ">
            <h1 className="font-[700] text-[25px] mb-5 ">Submitted Product</h1>
            <div className=" h-[450px] gap-4 mx-2 bg-[white] shadow-lg rounded-lg  flex-col   flex p-7">
              <div className="  flex gap-4 mx-5  ">
                <Image
                  className="h-[200px] w-[200px] bg-[red] rounded-[20px]"
                  src={
                    pendReq.subProduct.prodPic ||
                    "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
                  }
                  width={400}
                  height={400}
                  alt="Loading Icon"
                />
                <div className="flex flex-col justify-center gap-2">
                  <h1 className="font-[800]  text-[28px] ">
                    {pendReq.subProduct.prodName}
                  </h1>
                  <h1 className="font-[500]  text-[15px] border-[orange] border-[2px] rounded-[20px] px-3 flex justify-center items-center">
                    {pendReq.subProduct.prodDepartment}
                  </h1>
                </div>
              </div>
              <div className="">
                <p>{pendReq.subProduct.prodDesc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {loadingData === false && (
        <button
          onClick={() => setOpenPopup(true)}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Submit Request
        </button>
      )}
      {openPopup && <MergePordPopup setOpenPopup={setOpenPopup} id={pendReq.id} />}
    </div>
  );
};

export default page;
