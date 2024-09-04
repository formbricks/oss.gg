import React, { ReactElement, ReactNode, useState } from "react";

// Defining the ToggleProps interface to accept children as React nodes
interface ToggleProps {
  children: ReactNode;
}

// ToggleHeadProps to explicitly type the onClick prop
interface ToggleHeadProps {
  children: ReactNode;
  onClick?: () => void;
  isOpen?: boolean;
}

// ToggleContentProps interface
interface ToggleContentProps {
  children: ReactNode;
}

// Toggle Component to wrap around ToggleHead and ToggleContent
export function Toggle({ children }: ToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Type assertion to ensure proper typing when using React.cloneElement
          const element = child as ReactElement;

          // Check if the child is ToggleHead by its displayName
          if (element.type === ToggleHead) {
            // Clone the ToggleHead and pass down the onClick handler
            return React.cloneElement(element, {
              onClick: () => setIsOpen(!isOpen),
              isOpen: isOpen,
            });
          }
          // Check if the child is ToggleContent and toggle its visibility
          if (element.type === ToggleContent) {
            return isOpen ? element : null;
          }
        }
        return child;
      })}
    </div>
  );
}

// ToggleHead component to act as the clickable header
export function ToggleHead({ children, onClick, isOpen }: ToggleHeadProps) {
  return (
    <div className="flex cursor-default items-center gap-x-2" onClick={onClick}>
      <span>{isOpen ? "▼" : "▶"}</span>
      {children}
    </div>
  );
}

// ToggleContent component that renders its children based on the Toggle's open state
export function ToggleContent({ children }: ToggleContentProps) {
  return <div className="space-y-1 px-1 py-0.5">{children}</div>;
}

// Setting the display names to make component type checks reliable
ToggleHead.displayName = "ToggleHead";
ToggleContent.displayName = "ToggleContent";
