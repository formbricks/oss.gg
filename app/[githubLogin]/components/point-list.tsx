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
    <div className="col-span-4 grid h-fit grid-cols-4 gap-4 md:col-span-1 md:grid-cols-1">
      {pointsAndRanks.map((repo, index) => (
        <div key={repo.id} className="space-y-1">
          {repo.repositoryLogo && (
            <Image src={repo.repositoryLogo} height={25} width={25} alt={`${repo.repositoryName} logo`} />
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
