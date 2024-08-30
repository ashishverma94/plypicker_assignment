"use client";

import axios from "axios";
import Image from "next/image";
import { ProductRow } from "@/components";
import { useEffect, useState } from "react";
import LoadingGif from "../../../assets/Loading2.gif";
import { useRouter } from "next/navigation";

interface IProductData {
  currProduct: {
    prodPic: string;
    prodName: string;
    prodDepartment: string;
    prodDesc: string;
  };
  _id: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [productData, setProductData] = useState<IProductData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState("admin");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoadingData(true);
        const response = await axios.get(`/api/product`);
        setProductData(response?.data?.products);
        setRole(response.data.role);
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
    <div className=" mt-[80px] border-t-4 border-[orange] h-min-[90vh] bg-[#efeded]">
      <h1 className=" text-4xl font-[700] text-center py-3">Dashboard</h1>
      <div className="w-full justify-end flex pr-5">
        {loadingData === false && role === "admin" && (
          <button
            onClick={() => router.push("/pending-requests")}
            className="bg-orange-500 text-white font-semibold py-2 px-3 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            View Pending Requests
          </button>
        )}
      </div>

      <div className="pc:w-[50%] tablet:w-[70%] w-[100%] py-4  flex justify-center items-center flex-col">
        {error && (
          <div className="text-[red] font-bold"> {error && error} </div>
        )}
        {loadingData || !productData ? (
          <div className=" flex justify-center items-center w-full h-[70vh]">
            <Image
              className="h-[130px] w-[130px]"
              src={LoadingGif}
              width={400}
              height={400}
              alt="Loading Icon"
            />
          </div>
        ) : (
          <div className="flex w-full justify-center m-auto flex-col gap-4">
            {productData.map((product, index: number) => {
              return (
                <ProductRow
                  prodPic={product.currProduct.prodPic}
                  prodName={product.currProduct.prodName}
                  prodDepartment={product.currProduct.prodDepartment}
                  prodDesc={product.currProduct.prodDesc}
                  id={product._id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
