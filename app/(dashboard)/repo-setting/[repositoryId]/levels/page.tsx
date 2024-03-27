import { LevelsForm } from "@/components/forms/levels-form";
import LevelsTagInput from "@/components/levels-tag-input";

export const metadata = {
  title: "Repo Levels settings",
  description: " Set up levels for your repository.",
};

export default function Levels() {
  return (
    <div>
      <LevelsForm />
    </div>
  );
}
