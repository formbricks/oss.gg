import { TGithubUserData } from "@/types/githubUser";
import Image from "next/image";

import SocialLinks from "./social-links";

interface ProfileInfoProps {
  githubData: TGithubUserData;
  totalPoints: number;
  globalRank: number;
  chanceOfWinning: number;
}

const ProfileInfoBar: React.FC<ProfileInfoProps> = ({
  githubData,
  totalPoints,
  globalRank,
  chanceOfWinning,
}) => (
  <div className="grid w-full grid-cols-5 gap-6">
    <Image src={githubData.avatar_url} alt="github avatar" width={90} height={90} priority />
    <div className="col-span-4 flex w-full items-center justify-between space-x-6">
      <div className="flex flex-1 items-center gap-x-6">
        <div>
          <h1 className="text-3xl font-bold">{githubData.name}</h1>
          <p className="mt-1 text-xs">{githubData.bio}</p>
        </div>
        <SocialLinks
          twitterUsername={githubData.twitter_username}
          githubUrl={githubData.html_url || "https://formbricks.com/github"}
        />
      </div>

      <div className="text-right">
        <h2 className="text-3xl font-bold">#{globalRank}</h2>
        <p className="text-xs">{totalPoints} points</p>
        <p className="text-xs">{Math.ceil(chanceOfWinning * 100)}% chance to win</p>
      </div>
    </div>
  </div>
);

export default ProfileInfoBar;
