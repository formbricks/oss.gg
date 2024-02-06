import Image from "next/image"
import Link from "next/link"
import { Twitter } from "lucide-react"

export const metadata = {
  title: "Profile Page",
}

async function fetchGithubUserData(userName: string) {
  const res = await fetch(`https://api.github.com/users/${userName}`)
  const data = await res.json()
  return data
}

export default async function ProfilePage({ params }) {
  const userData = await fetchGithubUserData(params.profile)
  return (
    <div>
      <div className="flex items-center space-x-8 -mt-32 z-40 text-slate-50">
        <Image
          src={userData.avatar_url}
          alt="github avatar"
          width={180}
          height={180}
          className="rounded-md"
        />
        <div>
          <h1 className="text-3xl font-bold -mt-4">{userData.name}</h1>
          <p className="">{userData.bio}</p>
        </div>
        <Link
          href={`https://twitter.com/${userData.twitter_username}`}
          target="_blank"
        >
          <Twitter
            className="h-10 w-10 hover:scale-110 transition-all duration-150 ease-in-out"
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
  )
}
