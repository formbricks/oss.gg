"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCallback, useEffect, useState } from "react";

import {
  disenrollCurrentUserAction,
  enrollCurrentUserAction,
  hasEnrollmentForRepositoryAction,
} from "./actions";

export default function EnrollmentStatusBar({ repositoryId }) {
  const { toast } = useToast();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkEnrollmentStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const enrolled = await hasEnrollmentForRepositoryAction(repositoryId);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error("Failed to check enrollment:", error);
      toast({
        title: "Error",
        description: "Failed to check enrollment status.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId, toast]);

  useEffect(() => {
    checkEnrollmentStatus();
  }, [checkEnrollmentStatus]);

  const handleEnrollmentChange = useCallback(
    async (isEnrolling) => {
      setIsLoading(true);
      try {
        console.log("came in try for handleenrolmchange");
        
        if (isEnrolling) {
          console.log("is enrolling tru");
          
          await enrollCurrentUserAction(repositoryId);
          console.log("await over enrol current action");
          
          toast({ title: "Let the games begin 🕹️", description: "You're successfully enrolled." });
        } else {
          await disenrollCurrentUserAction(repositoryId);
          toast({ title: "You're out 👋", description: "Sorry to see you go, bratek." });
        }
        await checkEnrollmentStatus();
      } catch (error) {
        console.error("Error changing enrollment status", error);
        toast({
          title: "Error",
          description: `Failed to change enrollment status due to: ${error.message}`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [repositoryId, toast, checkEnrollmentStatus]
  );

  return (
    <div className="flex items-center justify-between rounded-md bg-muted p-4">
      <p className="font-mono">
        {isEnrolled
          ? "Status: You're in! Work on some open issues to get points 🕹️"
          : "Status: You are not yet playing. Enroll to get started 🤸"}
      </p>
      <Button
        size="sm"
        onClick={() => handleEnrollmentChange(!isEnrolled)}
        loading={isLoading}
        className={isEnrolled ? "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900" : ""}>
        {isEnrolled ? "Disenroll" : "Enroll to play"}
      </Button>
    </div>
  );
}
