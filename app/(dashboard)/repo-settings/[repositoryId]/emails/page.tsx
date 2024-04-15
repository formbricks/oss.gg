import { CelebrationEmailForm } from "@/components/forms/emails-form";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Project description settings",
  description: "set up project description settings for your repo and community",
};

const celebrationEmails = [
  {
    email: "Milestone Achievement Email",
    description: "This email is sent to celebrate a significant milestone achieved by the user.",
    emailTitle: "Congratulations! You've reached a significant milestone!",
  },
  {
    email: "Accomplishment Recognition Email",
    description: "This email is sent to recognize a notable accomplishment by the user.",
    emailTitle: "Well done! Your accomplishment deserves recognition!",
  },
  {
    email: "Special Achievement Email",
    description: "This email is sent to acknowledge a special achievement by the user.",
    emailTitle: "Kudos! You've achieved something exceptional!",
  },
  {
    email: "Performance Excellence Email",
    description: "This email is sent to appreciate the user's outstanding performance.",
    emailTitle: "Bravo! Your performance has been exceptional!",
  },
  {
    email: "Skill Mastery Email",
    description: "This email is sent to celebrate the mastery of a particular skill by the user.",
    emailTitle: "Congratulations! You've mastered a new skill!",
  },
];

export default function Emails() {
  return (
    <div className="space-y-6">
      {celebrationEmails.map((celebrationEmail) => (
        <CelebrationEmailForm
          emailTitle={celebrationEmail.emailTitle}
          email={celebrationEmail.email}
          description={celebrationEmail.description}
        />
      ))}
    </div>
  );
}
