"use client";

import { ModifiedTagsArray, calculateLevelProgress } from "@/lib/utils/levelUtils";
import { TLevel } from "@/types/level";
import { capitalizeEachWord } from "lib/utils/textformat";
import { FaCheckCircle } from "react-icons/fa";

import { Avatar, AvatarImage } from "./avatar";
import { ConditionalParagraphAssignable, ConditionalParagraphNonAssignable } from "./conditional-paragraph";
import ProgressBar from "./progressBar";

interface LevelDetailCardProps {
  level: TLevel;
  idx: number;
  modifiedTagsArray: ModifiedTagsArray[];
  totalPoints: number;
  currentLevelOfUser: TLevel | null;
  nextLevelForUser: TLevel | null;
  sortedLevels: TLevel[];
}

const LevelDetailCard = ({
  level,
  idx,
  modifiedTagsArray,
  totalPoints,
  currentLevelOfUser,
  nextLevelForUser,
  sortedLevels,
}: LevelDetailCardProps) => {
  const { progressMadeInThisLevel } = calculateLevelProgress(
    totalPoints,
    currentLevelOfUser,
    nextLevelForUser
  );
  const isLevelCompleted = idx <= sortedLevels.length - 1 && totalPoints >= sortedLevels[idx].pointThreshold;
  const completedCurrentLevelPercentage = progressMadeInThisLevel * 100;
  const isNotStarted = totalPoints < level.pointThreshold;

  let levelStatus: string | React.ReactNode = "";
  let progressBarStatus: number;

  if (isLevelCompleted) {
    levelStatus = (
      <>
        Completed <FaCheckCircle />
      </>
    );
    progressBarStatus = 1; //1 means 100 in %
  } else if (isNotStarted) {
    levelStatus = `Not started`;
    progressBarStatus = 0;
  } else {
    levelStatus = `${completedCurrentLevelPercentage.toFixed(2)}% Complete`;
    progressBarStatus = progressMadeInThisLevel;
  }

  return (
    <div
      className={`relative my-8 grid grid-cols-3  rounded-lg border p-4 text-center ${level.id === currentLevelOfUser?.id ? "border-primary" : ""} ${isLevelCompleted ? "border-primary bg-secondary" : ""}`}>
      {level.id === currentLevelOfUser?.id && (
        <div className="absolute right-0 h-fit w-fit -translate-x-full -translate-y-1/2 rounded-full border bg-primary p-1 px-2 text-sm font-medium text-secondary">
          Your current level
        </div>
      )}
      <section className="flex flex-col items-center justify-center gap-3 p-2">
        <Avatar className="h-40 w-40">
          <AvatarImage src={level.iconUrl} alt="level icon" />
        </Avatar>
        <div className="font-medium">Level {idx}</div>
        <div className="text-3xl font-semibold">{capitalizeEachWord(level.name)}</div>
        <div>{level.description}</div>
      </section>
      <section className="flex flex-col items-center space-y-2 p-2">
        <div className="mb-2 text-lg font-semibold">Powers</div>
        <ConditionalParagraphAssignable
          condition={level.permissions.canHuntBounties}
          text={"Hunt bounties"}
        />
        <ConditionalParagraphAssignable
          condition={level.permissions.canReportBugs}
          text={"Can report bugs 🐛"}
        />
        {modifiedTagsArray.map((item) => {
          const allIssues = [...item.assignableIssues, ...item.nonAssignableIssues];

          return (
            item.levelId === level.id &&
            allIssues.map((tag) => {
              const isAssignable = item.assignableIssues.includes(tag);
              return isAssignable ? (
                <ConditionalParagraphAssignable
                  key={tag}
                  condition={true}
                  text={`Can work on "${tag}" issues`}
                />
              ) : (
                <ConditionalParagraphNonAssignable key={tag} text={`Can work on "${tag}" issues`} />
              );
            })
          );
        })}
      </section>
      <section className="flex flex-col items-center justify-center gap-3  p-2">
        {sortedLevels[idx] && (
          <>
            <div className=" text-lg font-semibold">Points to level up</div>
            <div className="text-8xl font-bold">{sortedLevels[idx].pointThreshold}</div>
            <ProgressBar progress={progressBarStatus} height={3} className="w-3/4" />
            <div className="flex items-center gap-2 rounded-full border bg-background p-1 px-2 text-sm font-medium text-primary">
              {levelStatus}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default LevelDetailCard;
