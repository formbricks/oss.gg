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
    <div className=" flex h-auto min-h-[4.5rem] w-full justify-between border-b    py-md text-[#09090B]">
      <Link className="" key={userGitHubId} href={`https://github.com/${userGitHubId}`} target="_blank">
        <div className="flex  w-fit  items-center gap-[0.85rem] text-[1rem] font-[500]  dark:text-white ">
          <div className="h-[1.5rem] w-[1.2rem]  ">#{index}</div>
          <div>
            <UserAvatar
              className="h-[2rem] w-[2rem] dark:text-white "
              user={{ name: name, avatarUrl: avatarUrl }}
            />
          </div>
          <div>{name}</div>
        </div>
      </Link>
      <div className="flex w-auto items-center gap-md  ">
        {showSettingButtons && (
          <div className="flex gap-md">
            <Button
              variant={"destructive"}
              className=" rounded-lg bg-[#EF4444] px-md font-[500]"
              onClick={kickAndBlockHandler}>
              Kick and block
            </Button>
            <Button
              className=" rounded-lg bg-[#F4F4F5] px-md font-[500] text-black"
              variant={"default"}
              onClick={kickAndBlockHandler}>
              Mute
            </Button>
            <Button
              className=" rounded-lg bg-[#F4F4F5] px-md font-[500] text-black"
              variant={"default"}
              onClick={kickAndBlockHandler}>
              Change Points
            </Button>
          </div>
        )}
        <div className=" w-[6rem] whitespace-nowrap text-justify   font-[400] dark:text-white">
          {points} points
        </div>
      </div>
    </div>
  );
};
export default UserProfileSummary;
