"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UserProfileSummary from "@/components/ui/userProfileSummary";
import { capitalizeEachWord } from "@/lib/utils/textformat";
import { TLevel } from "@/types/level";
import { TPointTransactionWithUser } from "@/types/pointTransaction";
import { useCallback, useEffect, useRef, useState } from "react";

import { getPointsOfUsersInRepoByRepositoryIdAction } from "../actions";

interface LeaderboardProps {
  leaderboardProfiles: TPointTransactionWithUser[];
  repositoryId: string;
  itemPerPage: number;
  sortedLevels: TLevel[];
}

export default function Leaderboard({
  leaderboardProfiles,
  repositoryId,
  itemPerPage,
  sortedLevels,
}: LeaderboardProps): JSX.Element {
  const loadingRef = useRef(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(leaderboardProfiles.length < itemPerPage ? false : true);
  const [profiles, setProfiles] = useState<TPointTransactionWithUser[]>(leaderboardProfiles);

  const fetchNextPage = useCallback(async () => {
    const newPage = page + 1;
    const newProfiles = await getPointsOfUsersInRepoByRepositoryIdAction(repositoryId, newPage);
    if (newProfiles.length === 0 || newProfiles.length < itemPerPage) {
      setHasMore(false);
    }

    setProfiles([...profiles, ...newProfiles]);
    setPage(newPage);
  }, [page, profiles, itemPerPage, repositoryId]);

  useEffect(() => {
    const currentLoadingRef = loadingRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (hasMore) fetchNextPage();
        }
      },
      { threshold: 0.8 }
    );

    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [fetchNextPage, hasMore]);

  let runningIndex = 1;
  return (
    <>
      {sortedLevels.length > 0
        ? sortedLevels.map((level, levelIndex) => {
            // Filter profiles for this level
            const eligibleProfiles = profiles.filter((profile) => {
              // Check if profile is eligible for this level
              const isEligible = profile.points >= level.pointThreshold;

              // Check if the profile has not been assigned to any lower level
              const lowerLevels = sortedLevels.slice(0, levelIndex); // Lower levels
              const assignedLowerLevel = lowerLevels.some(
                (lowerLevel) => profile.points >= lowerLevel.pointThreshold
              );

              return isEligible && !assignedLowerLevel;
            });

            return (
              <div key={level.id}>
                <div className="mt-6 border-b-2  border-foreground  py-3">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={level.iconUrl} alt="level icon" />
                    </Avatar>
                    <div className="">
                      Level {sortedLevels.length - levelIndex}: {capitalizeEachWord(level.name)}
                    </div>
                  </div>
                </div>
                {eligibleProfiles.length > 0 ? (
                  eligibleProfiles.map((profile) => (
                    <>
                      <UserProfileSummary
                        key={`${profile.login}-${level.id}`}
                        name={profile.name || profile.login}
                        points={profile.points}
                        avatarUrl={profile.avatarUrl || ""}
                        userGitHubId={profile.login}
                        index={runningIndex++}
                      />
                    </>
                  ))
                ) : (
                  <p key={`${level.id}-no-players`}>
                    No player levelled up here yet. Who&prime;s gonna be the first?
                  </p>
                )}
              </div>
            );
          })
        : profiles.map((profile, idx) => (
            <UserProfileSummary
              key={profile.login}
              name={profile.name || profile.login}
              points={profile.points}
              avatarUrl={profile.avatarUrl || ""}
              userGitHubId={profile.login}
              index={idx + 1}
            />
          ))}

      <div ref={loadingRef}></div>
    </>
  );
}
