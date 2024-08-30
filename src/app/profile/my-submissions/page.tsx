"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmissionRow } from "@/components";
import LoadingGif from "../../../../assets/Loading2.gif";

interface IProdReqs {
  newProduct: {
    prodName: string;
    prodDepartment: string;
  };
  status: string;
  adminName?: string;
}
const page = () => {
  const router = useRouter();
  const [reqData, setReqData] = useState<IProdReqs[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setLoadingData(true);
        const response = await axios.get(`/api/product/user`);
        setReqData(response?.data?.userReqs);
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

  return (
    <div className="mt-[80px] bg-[#edebeb] flex flex-col items-center gap-5 p-3 h-[90vh]">
      <h1 className="font-[800] text-[25px] mt-6">All Submissions</h1>
      <div className="  w-full md:w-[75%]   border-[2px] border-[#656262]">
        <div className=" flex border-b-2">
          <div className=" bg-[black] text-center text-white w-1/4 py-2 flex justify-center font-[500] text-[17px]">
            Product Name
          </div>
          <div className=" bg-[black] text-center text-white w-1/4 py-2 flex justify-center font-[500] text-[17px]">
            Product Department
          </div>
          <div className=" bg-[black] text-center text-white w-1/4 py-2 flex justify-center font-[500] text-[17px]">
            Product Status
          </div>
          <div className=" bg-[black] text-center text-white w-1/4 py-2 flex justify-center font-[500] text-[17px]">
            Admin Name
          </div>
        </div>
        <div className=" overflow-y-scroll h-[50vh]">
          {loadingData ? (
            <div className="flex justify-center items-center h-full w-full">
              <Image
                className="h-[110px] w-[110px]"
                src={LoadingGif}
                width={400}
                height={400}
                alt="Loading Icon"
              />
            </div>
          ) : reqData.length === 0 ? (
            <div className="flex justify-center text-[gray] font-[600] text-[25px] items-center h-full w-full">
              No requests submitted
            </div>
          ) : (
            reqData.map((item, index) => {
              return (
                <SubmissionRow
                  key={index}
                  prodName={item.newProduct.prodName}
                  prodDept={item.newProduct.prodDepartment}
                  status={item.status}
                  adminName={item.adminName || ""}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
