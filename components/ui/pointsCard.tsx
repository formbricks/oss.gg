"use client";

import Image from "next/image";

interface PointsCardProps {
  repositoryName: string;
  repositoryLogo?: string;
  points: number;
  rank: number;
}

const PointsCard: React.FC<PointsCardProps> = ({
  repositoryName,
  repositoryLogo,
  points,
  rank,
}: PointsCardProps): JSX.Element => {
  return (
    <>
      <div className=" flex items-center justify-center rounded-lg bg-secondary">
        <div className="m-4 flex w-full flex-col items-center gap-4 rounded-lg bg-popover p-4 font-semibold">
          <div className="flex items-center gap-2">
            <div className="text-3xl">{repositoryName}</div>
            <Image src={repositoryLogo || ""} height={50} width={50} alt="logo" />
          </div>
          <div className="text-8xl font-bold">{points}</div>
          <div># Rank {rank}</div>
        </div>
      </div>
    </>
  );
};

export default PointsCard;
