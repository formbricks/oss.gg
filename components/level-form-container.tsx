"use client";

import { TLevel } from "@/types/level";
import React, { useEffect, useRef, useState } from "react";

import { LevelsForm } from "./forms/levels-form";
import { Button } from "./ui/button";

export default function LevelsFormContainer({ levelsData }: { levelsData: TLevel[] }) {
  const [showForm, setShowForm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    if (containerRef.current && showForm) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [showForm]);
  return (
    <div className="space-y-6" ref={containerRef}>
      {levelsData.map((level) => (
        <LevelsForm key={level.id} isForm={false} level={level} setShowForm={setShowForm} />
      ))}

      {showForm && <LevelsForm isForm={true} setShowForm={setShowForm} level={null} />}
      <div>
        <Button variant="secondary" onClick={toggleFormVisibility}>
          {showForm ? "Cancel" : "Add Level"}
        </Button>
      </div>
    </div>
  );
}
