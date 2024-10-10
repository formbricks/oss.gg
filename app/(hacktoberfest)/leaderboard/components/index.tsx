"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LeaderboardEntry } from "@/lib/points/service";
import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

interface ILeaderBoard {
  allUserPoints: LeaderboardEntry[];
  totalPlayers: number;
}
export default function LeaderBoardPage({ allUserPoints, totalPlayers }: ILeaderBoard) {
  return (
    <Suspense fallback={<div>hang tight while we&apos;re loading the leader list...</div>}>
      <LeaderBoard allUserPoints={allUserPoints} totalPlayers={totalPlayers} />
    </Suspense>
  );
}

function LeaderBoard({ allUserPoints, totalPlayers }: ILeaderBoard) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(allUserPoints);

  function findRank(user) {
    let rank = allUserPoints.findIndex((originalUser) => originalUser.userId === user.userId) + 1;
    return rank;
  }

  useEffect(() => {
    // In future we can add debounce
    setFilteredUsers(
      allUserPoints.filter((user) => user.login.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, allUserPoints]);

  return (
    <>
      <Card className="mx-auto my-12 w-full max-w-2xl overflow-hidden border-none bg-background">
        <CardHeader className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="flex items-center text-base font-bold ">leaderboard 🕹️</CardTitle>
            <span className="text-xs">
              players: {allUserPoints.length} of {totalPlayers}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 transform" />
            <Input
              type="text"
              placeholder="search players..."
              className="border-primary-foreground/20 bg-primary-foreground/10 pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="py-6 text-center text-gray-500">no users found</div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between border-b px-6 py-4 transition-colors last:border-b-0 hover:bg-secondary/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={user.avatarUrl as string} alt={user.login} />
                        <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href={`/${user.login}`}
                        target="_blank"
                        className="allUserPoints transition-colors hover:text-primary hover:underline"
                        aria-label={`View ${user.login}'s GitHub profile`}>
                        <span className="text-sm">{user.login}</span>
                      </Link>

                      <span className="text-sm">rank: #{findRank(user)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-sm">{user.totalPoints} pts</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
