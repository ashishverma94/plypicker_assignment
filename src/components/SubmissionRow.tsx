import React, { FC } from "react";

type props = {
  prodName: string;
  prodDept: string;
  status: string;
  adminName: string;
};
const SubmissionRow: FC<props> = ({
  prodDept,
  prodName,
  status,
  adminName,
}) => {
  return (
    <div className=" flex border-b-2">
      <div className=" w-1/4 py-2 items-center flex justify-center font-[500] text-[17px]">
        {prodName}
      </div>
      <div className=" w-1/4 py-2 items-center flex justify-center font-[500] text-[17px]">
        {prodDept}
      </div>
      <div className=" w-1/4 py-2 items-center flex justify-center font-[500] text-[17px]">
        {status === "pending" && (
          <span className="text-[orange]">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
        {status === "rejected" && (
          <span className="text-[red]">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
        {status === "approved" && (
          <span className="text-[green]">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
      <div className=" w-1/4 py-2 items-center flex justify-center font-[500] text-[17px]">
        {!adminName ? (
          <span className="text-[gray]">No Data</span>
        ) : (
          <span className="text-[black]">{adminName}</span>
        )}
      </div>
    </div>
  );
};

export default SubmissionRow;
