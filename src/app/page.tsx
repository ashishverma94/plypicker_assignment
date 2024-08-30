"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="App">
      <div className="h-[90vh] mt-[70px] w-full justify-center items-center flex-col  flex font-[1000] text-[45px]">
        <div className="empty_text">Nothing Here !</div>
        <Button
          onClick={() => router.push("/dashboard")}
          className="text-[white] text-[17px] font-[400] my-2 bg-[orange] hover:bg-[#be8e34] hover:ring-2 hover:ring-[#orange] "
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
