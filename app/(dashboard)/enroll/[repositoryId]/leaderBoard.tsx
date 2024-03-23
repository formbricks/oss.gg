"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileSummary from "@/components/ui/userProfileSummary";
import { useState } from "react";

//assuming data from api is in decreasing order by points.
const userProfiles = [
  {
    name: "Formbricks",
    points: 50000,
    avatarUrl: "",
    userGitHubId: "dsfsdf",
  },
  {
    name: "dasds | Javascript 🤝 React ",
    points: 10000,
    avatarUrl: "",
    userGitHubId: "alice-wonderland",
    showSettingButtons: false,
  },
  {
    name: "Bob",
    points: 8000,
    avatarUrl: "",
    userGitHubId: "bob-the-builder",
  },
  {
    name: "Charlie",
    points: 5000,
    avatarUrl: "",
    userGitHubId: "charlie-brown",
    showSettingButtons: false,
  },
  {
    name: "David",
    points: 5500,
    avatarUrl: "",
    userGitHubId: "david-copperfield",
  },
  {
    name: "Emily",
    points: 4000,
    avatarUrl: "",
    userGitHubId: "emily-dickinson",
    showSettingButtons: false,
  },
  {
    name: "Frank",
    points: 3500,
    avatarUrl: "",
    userGitHubId: "frankenstein",
  },
  {
    name: "Grace",
    points: 3000,
    avatarUrl: "",
    userGitHubId: "grace-hopper",
    showSettingButtons: false,
  },
  {
    name: "Henry",
    points: 2500,
    avatarUrl: "",
    userGitHubId: "henry-ford",
  },
  {
    name: "Isla",
    points: 1500,
    avatarUrl: "",
    userGitHubId: "isla-fisher",
    showSettingButtons: false,
  },
  {
    name: "Jack",
    points: 1100,
    avatarUrl: "",
    userGitHubId: "jack-london",
  },
  {
    name: "Kim",
    points: 800,
    avatarUrl: "",
    userGitHubId: "kim-kardashian",
    showSettingButtons: false,
  },
  {
    name: "Liam",
    points: 500,
    avatarUrl: "",
    userGitHubId: "liam-neeson",
  },
  {
    name: "Mia",
    points: 400,
    avatarUrl: "",
    userGitHubId: "mia-farrow",
    showSettingButtons: false,
  },
  {
    name: "Noah",
    points: 100,
    avatarUrl: "",
    userGitHubId: "noah-wyle",
  },
  {
    name: "Olivia",
    points: 50,
    avatarUrl: "",
    userGitHubId: "noah-wyldfge",
  },
];

interface pointRangesInterface {
  label: string;
  value: string;
  description: string;
}
export default function LeaderBoard() {
  const [selectedPointsRange, setSelectedPointsRange] = useState<pointRangesInterface | null>(null);

  const pointsRanges: pointRangesInterface[] = [
    { label: "All", value: "all", description: "" },
    {
      label: "Repository Rookie",
      value: "lessThan500",
      description: "Contributors with less than 500 points",
    },
    {
      label: "Deploy Deputy",
      value: "between500and1000",
      description: "Contributors with points between 500 and 1000.",
    },
    {
      label: "Pushmaster Prime",
      value: "between1000and5000",
      description: "Contributors with points between 1000 and 5000.",
    },
    { label: "Legend", value: "moreThan5000", description: "Contributors with more than 5000 points." },
  ];

  const filteredProfiles = [...userProfiles].filter((profile) => {
    switch (selectedPointsRange?.value) {
      case "all":
        return true;
      case "lessThan500":
        return profile.points < 500;
      case "between500and1000":
        return profile.points >= 500 && profile.points < 1000;
      case "between1000and5000":
        return profile.points >= 1000 && profile.points < 5000;
      case "moreThan5000":
        return profile.points >= 5000;
      default:
        return true;
    }
  });

  return (
    <>
      <Tabs className="w-full" defaultValue={pointsRanges[0].value}>
        <>
          <TabsList>
            {pointsRanges.map((range) => (
              <div
                key={range.value}
                onClick={() => {
                  setSelectedPointsRange(range);
                }}>
                <TabsTrigger value={range.value}>{range.label}</TabsTrigger>
              </div>
            ))}
          </TabsList>
          <div>{selectedPointsRange ? selectedPointsRange.description : ""}</div>
        </>
      </Tabs>

      {filteredProfiles.map((profile, idx) => (
        <UserProfileSummary
          key={profile.userGitHubId}
          name={profile.name}
          points={profile.points}
          avatarUrl=""
          userGitHubId={profile.userGitHubId}
          index={idx + 1}
        />
      ))}
    </>
  );
}
