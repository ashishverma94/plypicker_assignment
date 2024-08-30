"use client";

import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProductCard, UpdatePopup } from "@/components";
import LoadingGif from "../../../../assets/Loading2.gif";

interface IProductData {
  currProduct: {
    prodPic: string;
    prodName: string;
    prodDepartment: string;
    prodDesc: string;
  };
  oldProduct: {
    prodPic?: string;
    prodName?: string;
    prodDepartment?: string;
    prodDesc?: string;
  };
  _id: string;
}

const page = () => {
  const { id }: { id: string } = useParams();
  const { toast } = useToast();

  const [productData, setProductData] = useState<IProductData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewOld, setViewOld] = useState(false);

  // UPDATE POPUP STATES
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoadingData(true);
        const response = await axios.get(`/api/product/${id}`);
        setProductData(response?.data?.product);
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

  if (!productData) return;

  return (
    <div className=" mt-[80px] min-h-screen pb-[30px] border-t-4 border-[orange] bg-[#efeded]">
      <h1 className=" text-4xl font-[700] text-center py-3">Product Detail</h1>
      <div className="pc:w-[50%] tablet:w-[70%] w-[100%] py-4  flex justify-center items-center flex-col">
        {error && (
          <div className="text-[red] text-[20px] font-[500]">
            {error && error}
          </div>
        )}
        {loadingData ? (
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
          productData && (
            <div className=" flex flex-col md:w-[90%] w-[97%] justify-center md:flex-row ">
              <ProductCard
                prodPic={productData.currProduct.prodPic}
                prodName={productData.currProduct.prodName}
                prodDepartment={productData.currProduct.prodDepartment}
                prodDesc={productData.currProduct.prodDesc}
                id={productData._id}
                setIsPopupOpen={setIsPopupOpen}
              />
              {viewOld && productData?.oldProduct && (
                <ProductCard
                  prodPic={
                    productData?.oldProduct.prodPic ||
                    "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
                  }
                  prodName={productData?.oldProduct.prodName}
                  prodDepartment={productData?.oldProduct.prodDepartment}
                  prodDesc={productData?.oldProduct.prodDesc}
                  id={productData._id}
                  setIsPopupOpen={setIsPopupOpen}
                />
              )}
            </div>
          )
        )}
      </div>
      {!loadingData && (
        <div className="w-full flex gap-4 justify-center items-center ">
          {productData?.oldProduct && (
            <Button onClick={() => setViewOld(!viewOld)}>
              {viewOld ? "Hide Old Info" : "See Old Info"}
            </Button>
          )}
        </div>
      )}

      {isPopupOpen && (
        <UpdatePopup
          setIsPopupOpen={setIsPopupOpen}
          oldProdName={productData.currProduct.prodName}
          oldProdDepartment={productData.currProduct.prodDepartment}
          oldProdDesc={productData.currProduct.prodDesc}
          idProduct={id}
          setProductData={setProductData}
        />
      )}
    </div>
  );
};

export default page;
