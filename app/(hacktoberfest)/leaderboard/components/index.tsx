"use client"

import { LeaderboardEntry } from "@/lib/points/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Search, UserRound } from "lucide-react"
import { Suspense, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";


interface ILeaderBoard {
    allUserPoints: LeaderboardEntry[]
}
export default function LeaderBoardPage({ allUserPoints }: ILeaderBoard) {
    return (
        <Suspense fallback={<div>hang tight while we&apos;re loading the leader list...</div>}>
            <LeaderBoard allUserPoints={allUserPoints} />
        </Suspense>
    );
}

function LeaderBoard({ allUserPoints }: ILeaderBoard) {

    const [searchTerm, setSearchTerm] = useState("")
    const [filteredUsers, setFilteredUsers] = useState(allUserPoints);

    function findRank(user) {
        let rank = allUserPoints.findIndex(
            (originalUser) => originalUser.userId === user.userId
        ) + 1;
        return rank
    }

    useEffect(() => {
        // In future we can add debounce 
        setFilteredUsers(
            allUserPoints.filter((user) =>
                user.login.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, allUserPoints]);

    return (
        <>
            <Card className="w-full max-w-2xl mx-auto my-12 bg-background shadow-lg overflow-hidden">
                <CardHeader className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <CardTitle className="text-3xl font-bold flex items-center ">
                            <Trophy className="mr-2 text-yellow-400" /> Leaderboard
                        </CardTitle>
                        <span className="text-sm">Total Users: {allUserPoints.length}</span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                        <Input
                            type="text"
                            placeholder="Search users..."
                            className="pl-12 bg-primary-foreground/10 border-primary-foreground/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[400px] overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-6 text-gray-500">
                                No users found
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.userId}
                                    className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-secondary/5 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <Avatar className="w-10 h-10 border-2 border-primary/20">
                                                <AvatarImage src={user.avatarUrl as string} alt={user.login} />
                                                <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{user.login}</span>
                                            <span className="text-sm">Rank: #{findRank(user)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <span className="text-sm">{user.totalPoints} pts</span>
                                        <a
                                            href={`/${user.login}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="allUserPoints hover:text-primary transition-colors"
                                            aria-label={`View ${user.login}'s GitHub profile`}
                                        >
                                            <UserRound className="w-5 h-5" />
                                        </a>
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
