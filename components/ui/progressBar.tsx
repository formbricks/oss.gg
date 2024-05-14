"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  barColor?: string;
  height: number;
  className?: string;
}

export default function ProgressBar({ progress, barColor, height, className }: ProgressBarProps) {
  return (
    <div className={cn(`h-${height} w-full rounded-full bg-border`, className)}>
      <div
        className={`h-${height} rounded-full bg-foreground`}
        style={{ backgroundColor: barColor, width: `${Math.floor(progress * 100)}%` }}></div>
    </div>
  );
}
