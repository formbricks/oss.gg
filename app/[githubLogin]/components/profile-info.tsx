import { TGithubUserData } from "@/types/githubUser";
import Image from "next/image";

import SocialLinks from "./social-links";

interface ProfileInfoProps {
  githubData: TGithubUserData;
}

const ProfileInfoBar: React.FC<ProfileInfoProps> = ({ githubData }) => (
  <div className="z-40 -mt-24 grid grid-cols-5 gap-6 text-zinc-50 md:-mt-36">
    <Image
      src={githubData.avatar_url}
      alt="github avatar"
      width={180}
      height={180}
      className="z-50 col-span-2 rounded-md md:col-span-1"
      priority
    />

    <div className="col-span-3 flex items-center space-x-6 md:col-span-4">
      <div>
        <h1 className="text-3xl font-bold">{githubData.name}</h1>
        <p className="mt-1 text-xs">{githubData.bio}</p>
      </div>

      <SocialLinks
        twitterUsername={githubData.twitter_username}
        githubUrl={githubData.html_url || "https://formbricks.com/github"}
      />
    </div>
  </div>
);

export default ProfileInfoBar;
