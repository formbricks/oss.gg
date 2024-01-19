import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Octokit } from 'octokit';

export const metadata = {
  title: "Profile Page",
}

async function fetchGithubUserData(userName) {
  const res = await fetch(`https://api.github.com/users/${userName}`)
  const data = await res.json()
  console.log(data)
  return data
}

export default async function ProfilePage({ params }) {
  const userData =  await fetchGithubUserData(params.profile);
  return (
    <Card>
      
      <CardHeader>  
        <CardTitle>{userData.name}</CardTitle>
        <CardDescription>{userData.bio}</CardDescription>
      </CardHeader>

      <CardContent>
        <p>TOP 3 Repos</p>
      </CardContent>

      <CardContent>
        <p>REPO 1</p>
      </CardContent>

      <CardContent>
        <p>REPO 2</p>
      </CardContent>

      <CardContent>
        <p>REPO 3</p>
      </CardContent>

      <CardFooter>
        <p>Skills/Languages</p>
      </CardFooter>
    </Card>
  )
}
