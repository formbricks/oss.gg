"use client";

import { FaCheckCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";

interface ConditionalParagraphProps {
  condition: boolean;
  text: string;
}

export function ConditionalParagraphAssignable({ condition, text }: ConditionalParagraphProps) {
  return condition ? (
    <div className="flex items-center gap-2">
      <FaCheckCircle />
      <p className="font-medium">{text}</p>
    </div>
  ) : null;
}
export function ConditionalParagraphNonAssignable({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 opacity-30">
      <FaRegCircle />
      <p className="font-medium">{text}</p>
    </div>
  );
}
