import { Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Profile Page",
};

async function fetchGithubUserData(userName: string) {
  const res = await fetch(`https://api.github.com/users/${userName}`);
  const data = await res.json();
  return data;
}

export default async function ProfilePage({ params }) {
  const userData = await fetchGithubUserData(params.profile);
  return (
    <div>
      <div className="z-40 -mt-32 flex items-center space-x-8 text-slate-50">
        <Image
          src={userData.avatar_url}
          alt="github avatar"
          width={180}
          height={180}
          className="rounded-md"
        />
        <div>
          <h1 className="-mt-4 text-3xl font-bold">{userData.name}</h1>
          <p className="">{userData.bio}</p>
        </div>
        <Link href={`https://twitter.com/${userData.twitter_username}`} target="_blank">
          <Twitter
            className="size-10 transition-all duration-150 ease-in-out hover:scale-110"
            strokeWidth="1px"
          />
        </Link>
        <Link href={userData.html_url} target="_blank">
          {/* <GitHub
            className="h-10 w-10 hover:scale-110 transition-all duration-150 ease-in-out"
            strokeWidth="1px" 
          /> */}
        </Link>
      </div>
    </div>
  );
}
