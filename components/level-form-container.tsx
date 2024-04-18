/* "use client";

import React from "react";

import { LevelsFormProps } from "./forms/levels-form";
import { Button } from "./ui/button";

export default function LevelsFormContainer({ data }: { data: LevelsFormProps[] }) {
  const [showForm, setShowForm] = React.useState(false);
  return (
    <div className="space-y-6">
      {data.map((level, index) => (
        <LevelsForm
          canHuntBounties={level.canHuntBounties}
          canReportBugs={level.canReportBugs}
          description={level.description}
          iconUrl={level.iconUrl}
          key={index}
          levelName={level.levelName}
          limitIssues={level.limitIssues}
          topics={level.topics}
          pointThreshold={level.pointThreshold}
        />
      ))}

      {/* shows an empty levels form when you click the add level */
/*
      {showForm && <LevelsForm isForm={true} />}

      <div>
        <Button variant="secondary" onClick={() => setShowForm(!showForm)}>
          Add Level
        </Button>
      </div>
    </div>
  );
}
 */
