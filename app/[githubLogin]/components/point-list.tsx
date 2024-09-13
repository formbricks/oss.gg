import Image from "next/image";
import React from "react";

interface PointsAndRanksProps {
  pointsAndRanks: Array<{
    id: string;
    repositoryName: string;
    repositoryLogo?: string;
    rank?: number;
    points: number;
  }>;
}

const PointsAndRanks: React.FC<PointsAndRanksProps> = ({ pointsAndRanks }) => {
  return (
    <div className="space-y-4">
      {pointsAndRanks.map((repo, index) => (
        <div key={repo.id} className="relative w-11/12">
          {repo.repositoryLogo && (
            <Image
              src={repo.repositoryLogo}
              height={25}
              width={25}
              alt={`${repo.repositoryName} logo`}
              className="mb-2"
            />
          )}
          <h3 className="font-semibold">{repo.repositoryName}</h3>
          <p>points: {repo.points}</p>
          <p>repo rank: {repo.rank || "-"}</p>
        </div>
      ))}
    </div>
  );
};

export default PointsAndRanks;
