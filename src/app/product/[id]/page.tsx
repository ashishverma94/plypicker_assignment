"use client";
import React from "react";
import { useParams } from "next/navigation";

const page = () => {
  const { id } = useParams();
  return <div className="mt-[80px]">{id}</div>;
};

export default page;
