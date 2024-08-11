import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TLevel } from "@/types/level";
import Image from "next/image";
import React from "react";

interface LevelListProps {
  levels: { currentLevelOfUser: TLevel | null; repoLogo: string }[];
}

const LevelList: React.FC<LevelListProps> = ({ levels }) => {
  const hasValidLevels = levels.some((level) => level.currentLevelOfUser !== null);

  if (!hasValidLevels) {
    return (
      <div className="h-fit rounded-md bg-zinc-50 py-10 text-center">
        <p className="text-sm text-slate-800">You haven&apos;t enrolled yet!</p>
        <Button href="/login" className="mt-4">
          Start playing 🕹️
        </Button>
      </div>
    );
  }

  return (
    <div className="col-span-1 flex flex-col gap-8 text-center">
      {levels.map(
        (level, index) =>
          level.currentLevelOfUser && (
            <div
              key={index}
              className="relative flex w-11/12 items-center justify-center rounded-lg bg-secondary py-3">
              <Avatar className="h-40 w-40">
                <AvatarImage
                  src={level.currentLevelOfUser.iconUrl}
                  alt={`${level.currentLevelOfUser.name} icon`}
                />
              </Avatar>
              {level.repoLogo && (
                <div className="absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3">
                  <Image
                    src={level.repoLogo}
                    height={40}
                    width={40}
                    alt={`Repository logo`}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default LevelList;
