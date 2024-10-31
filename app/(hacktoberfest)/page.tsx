"use client";

import Link from "next/link";

import { Toggle, ToggleContent, ToggleHead } from "../../components/toggle";

export default function IndexPage() {
  return (
    <div className="space-y-2 font-mono text-xs underline-offset-2">
      <h1 className="pb-2 font-bold">oss.gg hackathon 2024 🕹️</h1>
      <div><span className="font-bold">prizes & winners</span>
          <ol className="mt-2 list-decimal">
            <li className="flex items-center gap-2">
              <Link
                href="https://www.apple.com/macbook-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                Macbook Pro 2023 M3 14&quot;
              </Link>
              <Link href="/harshsbhat" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: harshsbhat
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href="https://www.apple.com/macbook-air/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                Macbook Air 2023 M3 15&quot;
              </Link>
              <Link href="/sateshcharan" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: sateshcharan
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href="https://www.apple.com/iphone-16/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                iPhone 16 with 512GB
              </Link>
              <Link href="/milanp19" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: milanp19
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href="https://www.playstation.com/en-us/ps5/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                Playstation 5
              </Link>
              <Link href="/AshishViradiya153" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: AshishViradiya153
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href="https://www.apple.com/airpods-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                AirPods Pro 2nd Gen
              </Link>
              <Link href="/unrenamed" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: unrenamed
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href="https://www.apple.com/airpods-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                AirPods Pro 2nd Gen
              </Link>
              <Link href="/adityadeshlahre" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: adityadeshlahre
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href="https://epomaker.com/products/epomaker-ep84"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                EPOMAKER EP84
              </Link>
              <Link href="/RajuGangitla" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: RajuGangitla
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href="https://epomaker.com/products/epomaker-x-aula-f75"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                EPOMAKER x AULA F75
              </Link>
              <Link href="/Devansh-Baghel" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: Devansh-Baghel
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href="https://epomaker.com/products/epomaker-x-aula-f75"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                EPOMAKER x AULA F75
              </Link>
              <Link href="/shahil-yadav" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: shahil-yadav
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span
                className="hover:underline">
                a brick 🧱 (or a $25 gift card)
              </span>
              <Link href="/shahil-yadav" target="_blank" className="hover:underline" rel="noopener noreferrer">
                🏆 winner: utkarshml
              </Link>
            </li>
          </ol>
          <p className="mt-2 font-bold">pls reach out to johannes@formbricks.com to collect your prize 🎉</p>
      </div>
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
      <Link href="/oss-issues" rel="noopener noreferrer" className="block hover:underline">
      👨‍💻 all code issues
      </Link>
      <Link href="/side-quests" rel="noopener noreferrer" className="block hover:underline">
      🏰 all side quests
      </Link>
      <Link
        target="_blank"
        href="https://formbricks.notion.site/How-to-make-1050-points-without-touching-code-in-5-minutes-e71e624b5b9b487bbac28030d142438a?pvs=74"
        rel="noopener noreferrer"
        className="block hover:underline">
       🔥 how to make 1050 points in 5 minutes without touching code
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
