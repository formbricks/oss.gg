import * as React from "react";

import { cn } from "@/lib/utils";
import { DoorClosed } from "lucide-react";

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

EmptyPlaceholder.Icon = function EmptyPlaceHolderIcon({
  name,
  className,
  ...props
}) {
  return (
    <div className="bg-muted flex size-20 items-center justify-center rounded-full">
      <DoorClosed className={cn("size-10", className)} {...props} />
    </div>
  );
};

interface EmptyPlacholderTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: EmptyPlacholderTitleProps) {
  return (
    <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props} />
  );
};

interface EmptyPlacholderDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlacholderDescriptionProps) {
  return (
    <p
      className={cn(
        "text-muted-foreground mb-8 mt-2 text-center text-sm font-normal leading-6",
        className
      )}
      {...props}
    />
  );
};
