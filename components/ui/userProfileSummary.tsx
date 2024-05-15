"use client";

import Link from "next/link";

import { UserAvatar } from "../user-avatar";
import { Button } from "./button";

interface UserProfileSummaryProps {
  name: string;
  points: number;
  avatarUrl: string;
  userGitHubId: string;
  index: number;
  showSettingButtons?: boolean;
}

const UserProfileSummary: React.FC<UserProfileSummaryProps> = ({
  name,
  points,
  avatarUrl,
  showSettingButtons = false,
  userGitHubId,
  index,
}) => {
  const kickAndBlockHandler = () => {
    //can be put in a separate actions.ts file

    return;
  };
  return (
    <Link key={userGitHubId} href={`https://oss.gg/${userGitHubId}`} target="_blank">
      <div className="group flex justify-between border-b py-4">
        <div className="flex w-fit items-center gap-4 sm:gap-12">
          <div>#{index}</div>
          <div>
            <UserAvatar className="h-8 w-8" user={{ name: name, avatarUrl: avatarUrl }} />
          </div>

          <div className="group-hover:underline">{name}</div>
        </div>

        <div className="flex w-auto items-center gap-4">
          {showSettingButtons && (
            <div className="flex gap-2">
              <Button size={"sm"} variant={"destructive"} onClick={kickAndBlockHandler}>
                Kick and block
              </Button>
              <Button size={"sm"} variant={"default"} onClick={kickAndBlockHandler}>
                Mute
              </Button>
              <Button size={"sm"} variant={"default"} onClick={kickAndBlockHandler}>
                Change Points
              </Button>
            </div>
          )}
          <div className=" w-[6rem] whitespace-nowrap text-justify   font-[400] dark:text-white">
            {points} points
          </div>
        </div>
      </div>
    </Link>
  );
};
export default UserProfileSummary;
