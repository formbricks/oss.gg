"use client";

import Link from "next/link";

import { Toggle, ToggleContent, ToggleHead } from "../../components/toggle";

export default function IndexPage() {
  return (
    <div className="space-y-2 font-mono text-xs underline-offset-2">
      <h1 className="pb-2 font-bold">oss.gg hackathon 2024 🕹️</h1>
      <Toggle>
        <ToggleHead>prizes</ToggleHead>
        <ToggleContent>
          <ol className="ml-7 list-decimal">
            <li>
              <Link
                href="https://www.apple.com/macbook-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                Macbook Pro 2023 M3 14&quot;
              </Link>
            </li>
            <li>
              <Link
                href="https://www.apple.com/macbook-air/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                Macbook Air 2023 M3 15&quot;
              </Link>
            </li>
            <li>
              <Link
                href="https://www.apple.com/ipad-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                iPhone 16 with 512GB
              </Link>
            </li>
            <li>
              <Link
                href="https://www.playstation.com/en-us/ps5/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                Playstation 5
              </Link>
            </li>
            <li>
              <Link
                href="https://www.apple.com/airpods-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                AirPods Pro 3rd Gen
              </Link>
            </li>
            <li>
              <Link
                href="https://www.apple.com/airpods-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                AirPods Pro 3rd Gen
              </Link>
            </li>
            <li>
              <Link
                href="https://epomaker.com/products/epomaker-ep84"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                EPOMAKER EP84
              </Link>
            </li>
            <li>
              <Link
                href="https://epomaker.com/products/epomaker-x-aula-f75"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                EPOMAKER x AULA F75
              </Link>
            </li>
            <li>
              <Link
                href="https://epomaker.com/products/epomaker-x-aula-f75"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                EPOMAKER x AULA F75
              </Link>
            </li>
            <li>a brick 🧱</li>
          </ol>
        </ToggleContent>
      </Toggle>
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
      <Toggle>
        <ToggleHead>side quests and challenges</ToggleHead>
        <ToggleContent>to be announced</ToggleContent>
      </Toggle>
      <h2 className="pt-4 font-bold">get started</h2>
      {/*       <p>
        <Link href="/oss-issues" rel="noopener noreferrer" className="hover:underline">
          browse available code issues
        </Link>
      </p>
      <p>
        <Link
          target="_blank"
          href="https://formbricks.notion.site/Placeholder-2aa60ea4053247579e2f89cbb5cbe58f?pvs=4"
          rel="noopener noreferrer"
          className="hover:underline">
          browse all side quests
        </Link>
      </p> */}
      <Link href="/signup" rel="noopener noreferrer" className="hover:underline">
        sign up to get started
      </Link>

      <h2 className="pt-4 font-bold">faq</h2>
      <Toggle>
        <ToggleHead>how to submit a non-code contribution via GitHub</ToggleHead>
        <ToggleContent>
          <ol className="list-decimal space-y-1 pl-5">
            <li>open an issue for your contribution. Use the side quest template.</li>
            <li>comment with /assign to assign yourself</li>
            <li>open a PR where you reference your issue</li>
            <li>in each repo you&apos;ll find a folder called &quot;oss.gg hackathon&quot;</li>
            <li>
              in each folder, there&apos;s one .txt file for each side quest. here we keep track of each
              submission
            </li>
            <li>
              add a new entry with the following info: Your GitHub name, a UTC timestamp, and a link with your
              proof of contribution.
            </li>
            <li>
              the project maintainer will add the corresponding points to the issue, review the PR and and
              once it&apos;s merged, you&apos;ll be awarded your points automatically.
            </li>
            <li>don&apos;t forget to check your current points at oss.gg/[yourGitHubUsername]</li>
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
    </div>
  );
}
