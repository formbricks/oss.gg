import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function EnrollPlayerSwitch() {
  return (
    <div className="flex w-full  rounded-lg border border-gray-200 bg-zinc-50 p-5">
      <div className="flex items-center space-x-2">
        <Switch id="allow-players-enroll" />
        <Label htmlFor="allow-players-enroll">Allow players to enroll</Label>
      </div>
    </div>
  );
}
