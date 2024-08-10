import ContributionItem from "@/components/ui/contribution";
import { TContribution } from "@/types/contribution";
import React from "react";

interface ContributionsListProps {
  contributions: TContribution[];
  profileName: string;
}

const ContributionsList: React.FC<ContributionsListProps> = ({ contributions, profileName }) => {
  const sortedContributions = [...contributions].sort(
    (a, b) => new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime()
  );

  return (
    <div className="col-span-4 space-y-12">
      {sortedContributions.length > 0 ? (
        <div>
          <h3 className="mb-2 text-xl font-medium">Contributions by {profileName}</h3>
          {sortedContributions.map((contribution) => (
            <ContributionItem key={contribution.href} contribution={contribution} />
          ))}
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-md bg-zinc-50">
          <p>{profileName} has not yet contributed to an oss.gg repository 🕹️</p>
        </div>
      )}
    </div>
  );
};

export default ContributionsList;
