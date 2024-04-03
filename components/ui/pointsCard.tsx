"use client";

import OSSLogoLight from "@/public/oss-gg-logo.png";
import Image from "next/image";

interface PointsCardProps {}
const PointsCard: React.FC<PointsCardProps> = ({}) => {
  return (
    <>
      <div className=" flex items-center justify-center rounded-lg bg-secondary">
        <div className="m-4 flex w-full flex-col items-center gap-4 rounded-lg bg-popover p-4 font-bold">
          <div className="flex gap-2">
            <div className="text-3xl">Formbricks</div>
            <Image src={OSSLogoLight} height={50} width={50} alt="logo" />
          </div>
          <div className="text-8xl">480</div>
          <div># Rank 237</div>
        </div>
      </div>
    </>
  );
};

export default PointsCard;
