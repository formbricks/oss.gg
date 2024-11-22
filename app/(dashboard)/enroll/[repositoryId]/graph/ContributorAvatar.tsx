"use client";

import Image from "next/image";

import { useState } from "react";

interface Contributor {
  avatarUrl: string;
  name: string;
  points: number;
  githubId: string;
}

interface Position {
  x: number;
  y: number;
  size: number;
}

interface ContributorAvatarProps {
  contributor: Contributor;
  position: Position;
}

export function ContributorAvatar({
  contributor,
  position,
}: ContributorAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const handleClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="absolute cursor-pointer overflow-hidden rounded-full border-2 border-gray-200 shadow-lg transition-transform hover:scale-105"
      style={{
        width: `${position.size}px`,
        height: `${position.size}px`,
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      onClick={() => handleClick(`https://github.com/${contributor.githubId}`)}
      role="link"
      aria-label={`View ${contributor.name}'s GitHub profile`}
    >
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-300 text-sm font-bold text-gray-600">
          {contributor.name[0]}
        </div>
      ) : (
        <Image
          src={contributor.avatarUrl}
          alt={`${contributor.name}'s avatar`}
          width={position.size}
          height={position.size}
          className="object-cover"
          onError={() => setHasError(true)}
          placeholder="blur"
          blurDataURL="/placeholder.svg?height=100&width=100"
        />
      )}
    </div>
  );
}