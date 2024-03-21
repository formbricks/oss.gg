import { LevelsForm } from "@/components/forms/levels-form";
import LevelsTagInput from "@/components/levels-tag-input";

export const metadata = {
  title: "Project description settings",
  description: "set up project description settings for your repo and community",
};

export default function Levels() {
  return (
    <div>
      <LevelsForm />
    </div>
  );
}
