"use client";

import UserProfileSummary from "@/components/ui/userProfileSummary";
import { TPointTransactionWithUser } from "@/types/pointTransaction";
import { useCallback, useEffect, useRef, useState } from "react";

import { getPointsOfUsersInRepoByRepositoryIdAction } from "./actions";

interface LeaderBoardProps {
  leaderboardProfiles: TPointTransactionWithUser[];
  repositoryId: string;
  itemPerPage: number;
}

export default function LeaderBoard({
  leaderboardProfiles,
  repositoryId,
  itemPerPage,
}: LeaderBoardProps): JSX.Element {
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

  return (
    <>
      {profiles.map((profile, idx) => (
        <UserProfileSummary
          key={profile.user.login}
          name={profile.user.name || ""}
          points={profile.points}
          avatarUrl={profile.user.avatarUrl || ""}
          userGitHubId={profile.user.login}
          index={idx + 1}
        />
      ))}
      <div ref={loadingRef}></div>
    </>
  );
}
