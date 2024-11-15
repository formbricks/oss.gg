"use client";

import Link from "next/link";

import { Toggle, ToggleContent, ToggleHead } from "../../components/toggle";

export default function IndexPage() {
  return (
    <div className="space-y-2 font-mono text-xs underline-offset-2">
      <h1 className="pb-2 font-bold">oss.gg hackathon 2024 is over 🕹️ - see you next year!</h1>
      <Toggle>
        <ToggleHead>how it works</ToggleHead>
        <ToggleContent>
          <p>
            complete{" "}
            <Link href="/code" className="underline">
              code
            </Link>{" "}
            and{" "}
            <Link href="/non-code" className="underline">
              non-code
            </Link>{" "}
            contributions to get points
          </p>
          <p>each point is a lottery ticket</p>

          <p>lottery happens on 31st of October 2024 🎃</p>
          <p>sign up for the kick-off stream here</p>
        </ToggleContent>
      </Toggle>
      <Toggle>
        <ToggleHead>follow these repos to not miss anything</ToggleHead>
        <ToggleContent>
          <ul>
            <li className="hover:underline">
              <Link href="https://x.com/dubdotco" target="_blank" rel="noopener noreferrer">
                @dubdotco
              </Link>
            </li>
            <li className="hover:underline">
              <Link href="https://x.com/formbricks" target="_blank" rel="noopener noreferrer">
                @formbricks
              </Link>
            </li>
            <li className="hover:underline">
              <Link href="https://x.com/hanko_io" target="_blank" rel="noopener noreferrer">
                @hanko
              </Link>
            </li>
            <li className="hover:underline">
              <Link href="https://x.com/openbb_finance" target="_blank" rel="noopener noreferrer">
                @openbb_finance
              </Link>
            </li>
            <li className="hover:underline">
              <Link href="https://x.com/papermarkio" target="_blank" rel="noopener noreferrer">
                @papermark
              </Link>
            </li>
            <li className="hover:underline">
              <Link href="https://x.com/twentycrm" target="_blank" rel="noopener noreferrer">
                @twentycrm
              </Link>
            </li>
            <li className="hover:underline">
              <Link href="https://x.com/unkeydev" target="_blank" rel="noopener noreferrer">
                @unkey
              </Link>
            </li>
          </ul>
        </ToggleContent>
      </Toggle>
      <p className="pt-4">
        <Link href="/signup" className="font-bold underline underline-offset-4 hover:no-underline">
          signup to play
        </Link>
      </p>

      <h2 className="pt-4 font-bold">faq</h2>
      <Toggle>
        <ToggleHead>how to submit a non-code contribution via GitHub</ToggleHead>
        <ToggleContent>
          <ol className="list-decimal space-y-1 pl-5">
            <li>open an issue for your contribution in the respective repo</li>
            <li>in the issue description, provide the requested proof</li>
            <li>wait for a maintainer to review it and award you points</li>
            <div className="py-2">
              <Link
                className="underline"
                href="https://formbricks.notion.site/How-to-submit-a-non-code-contributions-via-GitHub-81166e8c948841d18209ac4c60280e60"
                target="_blank"
                rel="noopener noreferrer">
                here is a manual with images
              </Link>
            </div>
          </ol>
        </ToggleContent>
      </Toggle>
      <Toggle>
        <ToggleHead>how does the lottery work?</ToggleHead>
        <ToggleContent>
          <p>for every contribution you get points</p>
          <p>each point is one lottery ticket</p>
          <p>all points collected in all repos are same</p>
          <p>the more points, the higher the chance to win</p>
          <p>but players with 1 point can also win a mac</p>
        </ToggleContent>
      </Toggle>
      <Toggle>
        <ToggleHead>can i win multiple prizes?</ToggleHead>
        <ToggleContent>you wish</ToggleContent>
      </Toggle>
      <Toggle>
        <ToggleHead>can i rig the system?</ToggleHead>
        <ToggleContent>
          <p>play fair to stay in the game</p> <p>cheat or spam to get disqualified</p>
        </ToggleContent>
      </Toggle>
      <h2 className="pt-4 font-bold">👇 get started</h2>
      <Link href="/leaderboard" rel="noopener noreferrer" className="block hover:underline">
      🕹️ leaderboard
      </Link>
      <Link
        target="_blank"
        href="https://oss.gg/discord"
        rel="noopener noreferrer"
        className="block hover:underline">
        🤖 join our Discord
      </Link>
      <Link href="https://lu.ma/qb3z1x05" rel="noopener noreferrer" className="block hover:underline">
      🎁 sign up for the price raffle
      </Link>
    </div>
  );
}
