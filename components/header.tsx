import { capitalizeFirstLetter } from "lib/utils/textformat";

interface DashboardHeaderProps {
  heading: string | undefined;
  text?: string | null | undefined;
  children?: React.ReactNode;
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-2">
        <h1 className="font-heading text-3xl md:text-4xl">{capitalizeFirstLetter(heading)}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
