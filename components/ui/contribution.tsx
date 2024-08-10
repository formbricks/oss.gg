import { TContribution } from "@/types/contribution";
import { formatDistanceToNow } from "date-fns";
import React from "react";

interface ContributionItemProps {
  contribution: TContribution;
}

const ContributionItem: React.FC<ContributionItemProps> = ({ contribution }) => {
  const getStatusColor = (status: TContribution["status"]) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "merged":
        return "bg-purple-100 text-purple-800";
      case "closed":
        return "bg-red-100 text-red-800";
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="mb-4 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-blue-600 hover:underline">
          <a href={contribution.href} target="_blank" rel="noopener noreferrer">
            {contribution.title}
          </a>
        </h3>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(contribution.status)}`}>
          {contribution.status}
        </span>
      </div>
      <p className="mb-2 text-sm text-gray-600">
        Opened by {contribution.author} {formatDate(contribution.dateOpened)}
      </p>
      {contribution.status === "merged" && contribution.dateMerged && (
        <p className="mb-2 text-sm text-gray-600">Merged {formatDate(contribution.dateMerged)}</p>
      )}
      {contribution.status === "closed" && contribution.dateClosed && (
        <p className="mb-2 text-sm text-gray-600">Closed {formatDate(contribution.dateClosed)}</p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Points: {contribution.points}</span>
      </div>
    </div>
  );
};

export default ContributionItem;
