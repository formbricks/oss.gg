"use client";

import { capitalizeFirstLetter } from "lib/utils/textformat";
import Image from "next/image";

interface PointsCardProps {
  repositoryName: string;
  repositoryLogo?: string | null;
  points: number;
  rank: number | null;
}

const PointsCard = ({ repositoryName, repositoryLogo, points, rank }: PointsCardProps) => {
  return (
    <>
      <div className="flex items-center justify-center rounded-lg bg-secondary">
        <div className="m-6 flex w-full flex-col items-center space-y-4 rounded-lg bg-popover p-4 font-semibold">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{capitalizeFirstLetter(repositoryName)}</div>
            {repositoryLogo && (
              <Image
                src={repositoryLogo}
                height={35}
                width={35}
                alt="repository-logo"
                className="rounded-lg"
              />
            )}
          </div>
          <p className="text-5xl font-semibold lg:text-8xl">{points}</p>
          <p className="font-normal">{rank === null ? "No points, no rank 🤷" : `# Rank ${rank}`}</p>
        </div>
      </div>
    </>
  );
};

export default PointsCard;
