"use client";

import Link from "next/link";

export default function SideQuestPage() {
  return (
    <div className="space-y-2 font-mono text-xs">
      <h1 className="pb-2 font-bold">side quest lists</h1>
      <Link
        href="https://d.to/ossgg-side-quests"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:underline">
        side quests: dub
      </Link>

      <Link
        href="https://formbricks.notion.site/Formbricks-Hacktoberfest-Side-Quests-Challenges-798855c705cc4474ba63ceefbe048abf?pvs=4"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:underline">
        side quests: formbricks
      </Link>

      <Link
        href="https://go.hanko.io/ossgg-2024"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:underline">
        side quests: hanko
      </Link>
      <p>
        <Link
          href="https://github.com/OpenBB-finance/OpenBB/issues/6705"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline">
          side quests: openbb
        </Link>{" "}
        +{" "}
        <Link
          href="https://github.com/OpenBB-finance/OpenBB/tree/develop/oss.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline">
          instructions
        </Link>
      </p>

      <Link
        href="https://mfts.notion.site/Papermark-Hacktoberfest-Side-Quests-Challenges-111d3f870f008033935efe9f7702a3dc?pvs=25"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:underline">
        side quests: papermark
      </Link>

      <Link
        href="https://bonapara.notion.site/Twenty-side-quests-10c11d84170380479870e751990f4462?pvs=4"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:underline">
        side quests: twenty
      </Link>

      <Link
        href="https://go.unkey.com/ossgg-challenges"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:underline">
        side quests: unkey
      </Link>
    </div>
  );
}
