"use client";

import { Toggle, ToggleContent, ToggleHead } from "../../../components/toggle";

export default function CodePage() {
  return (
    <div className="space-y-2 font-mono text-xs text-black">
      <h1 className="pb-2 font-bold">non-code contributions</h1>
      <p>there are two types: side quests and challenges</p>
      <Toggle>
        <ToggleHead>side quests</ToggleHead>
        <ToggleContent>every player can perform each side quest once</ToggleContent>
      </Toggle>
      <Toggle>
        <ToggleHead>challenges</ToggleHead>
        <ToggleContent>
          like code contributions, challenges can only be completed once. be quick.
        </ToggleContent>
      </Toggle>
    </div>
  );
}
