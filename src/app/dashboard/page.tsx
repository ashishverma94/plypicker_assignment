"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingGif from "../../../assets/Loading2.gif";
import Image from "next/image";
import { ProductRow } from "@/components";

interface IProductData {
  currProduct: {
    prodPic: string;
    prodName: string;
    prodDepartment: string;
    prodDesc: string;
  };
  _id: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [productData, setProductData] = useState<IProductData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoadingData(true);
        const response = await axios.get(`/api/product`);
        setProductData(response?.data?.products);
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
    <div className=" mt-[80px] border-t-4 border-[orange] bg-[#efeded]">
      <h1 className=" text-4xl font-[700] text-center py-3">Dashboard</h1>
      <div className="pc:w-[50%] tablet:w-[70%] w-[100%] py-4  flex justify-center items-center flex-col">
        {error && <div> {error && error} </div>}
        {loadingData || !productData ? (
          <div className=" flex justify-center items-center w-full h-[70vh]">
            <Image
              className="h-[230px] w-[230px]"
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
