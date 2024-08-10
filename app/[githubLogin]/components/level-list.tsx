import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TLevel } from "@/types/level";
// Adjust the import path as needed
import Image from "next/image";
import React from "react";

interface LevelListProps {
  levels: { currentLevelOfUser: TLevel | null; repoLogo: string }[];
}

const LevelList: React.FC<LevelListProps> = ({ levels }) => {
  return (
    <div className="col-span-1 hidden text-center md:flex md:flex-col md:gap-8">
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
