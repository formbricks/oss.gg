"use client";

import { calculateLevelProgress } from "@/lib/utils/levelUtils";
import { TLevel } from "@/types/level";
import { capitalizeEachWord, capitalizeFirstLetter } from "lib/utils/textformat";
import Image from "next/image";

import { Avatar, AvatarImage } from "./avatar";
import { ConditionalParagraphAssignable } from "./conditionalParagraph";
import ProgressBar from "./progressBar";

interface UserPointsAndLevelCardProps {
  repositoryName: string;
  repositoryLogo?: string | null;
  points: number;
  rank: number | null;
  currentLevelOfUser: TLevel | null;
  nextLevelForUser: TLevel | null;
  assignableTags: string[];
}

const UserPointsAndLevelCard = ({
  repositoryName,
  repositoryLogo,
  points,
  rank,
  currentLevelOfUser,
  nextLevelForUser,
  assignableTags,
}: UserPointsAndLevelCardProps) => {
  return (
    <div className="flex h-full items-center justify-center gap-6 rounded-lg bg-secondary p-6">
      {currentLevelOfUser && (
        <UserLevelCard currentLevelOfUser={currentLevelOfUser} assignableTags={assignableTags} />
      )}
      <UserPointsCard
        repositoryName={repositoryName}
        points={points}
        rank={rank}
        repositoryLogo={repositoryLogo}
        currentLevelOfUser={currentLevelOfUser}
        nextLevelForUser={nextLevelForUser}
      />
    </div>
  );
};

export default UserPointsAndLevelCard;

const UserLevelCard = ({ currentLevelOfUser, assignableTags }) => {
  return (
    <div className=" flex h-full w-full flex-col items-center space-y-4 rounded-lg bg-popover p-4 font-semibold">
      <Avatar className="h-40 w-40">
        <AvatarImage src={currentLevelOfUser.iconUrl} alt="level icon" />
      </Avatar>
      <div className="text-3xl">{capitalizeEachWord(currentLevelOfUser.name)}</div>
      <ConditionalParagraphAssignable
        condition={currentLevelOfUser.permissions.canHuntBounties}
        text={"Hunt bounties"}
      />
      <ConditionalParagraphAssignable
        condition={currentLevelOfUser.permissions.canReportBugs}
        text={"Can report bugs 🐛"}
      />
      {assignableTags.map((tag, idx) => {
        return (
          <ConditionalParagraphAssignable
            key={`${tag.id}+${idx}`}
            condition={true}
            text={`Can work on "${tag}" issues`}
          />
        );
      })}
    </div>
  );
};

const UserPointsCard = ({
  repositoryName,
  repositoryLogo,
  points,
  rank,
  currentLevelOfUser,
  nextLevelForUser,
}) => {
  const { progressMadeInThisLevel } = calculateLevelProgress(points, currentLevelOfUser, nextLevelForUser);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 rounded-lg bg-popover p-4 font-semibold">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{capitalizeFirstLetter(repositoryName)}</div>
        {repositoryLogo && (
          <Image src={repositoryLogo} height={35} width={35} alt="repository-logo" className="rounded-lg" />
        )}
      </div>
      <p className="text-5xl font-bold lg:text-8xl">{points}</p>
      <p className="text-lg font-semibold">{rank === null ? "No points, no rank 🤷" : `# Rank ${rank}`}</p>

      {currentLevelOfUser && (
        <div className=" flex w-11/12 flex-col space-y-3 pt-3">
          <ProgressBar barColor="#18181B" progress={progressMadeInThisLevel} height={3} />
          <div className="flex justify-between font-medium">
            <div className="flex flex-col items-start">
              <div>{capitalizeFirstLetter(currentLevelOfUser?.name)}</div>
              <div className="font-semibold">{currentLevelOfUser?.pointThreshold}</div>
            </div>
            {nextLevelForUser?.pointThreshold && (
              <div className="flex flex-col items-end">
                <div>{capitalizeFirstLetter(nextLevelForUser.name)}</div>
                <div className="font-semibold">{nextLevelForUser.pointThreshold}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
