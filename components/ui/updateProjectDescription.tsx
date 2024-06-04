"use client";

import Tiptap from "@/components/ui/tiptap-editor";
import { use, useEffect, useState } from "react";

export default function UpdateProjectDescription({ repositoryId, action }) {
  const [description, setDescription] = useState(
    "<p>Make work with the current description on repository detail page.</p>"
  );

  useEffect(() => {
    const fetchDescription = async () => {
      const repo = await action(description);
      setDescription(repo.projectDescription || description);
    };
    // add debounce here to avoid too many requests
    const debounced = setTimeout(() => {
        fetchDescription();
        }
    , 2000);
    return () => clearTimeout(debounced);
  }, [repositoryId]);
 
  return (
    <div>
      <Tiptap fn={setDescription} content={description} />
    </div>
  );
}
