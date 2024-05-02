"use client";

import { deleteLevelAction } from "@/app/(dashboard)/repo-settings/[repositoryId]/levels/action";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

interface DeleteLevelModalProps {
  showDeleteLevelModal: boolean;
  setShowDeleteLevelModal: Dispatch<SetStateAction<boolean>>;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
  repositoryId: string;
  levelId: string;
  iconUrl: string;
}

function DeleteLevelModal({
  showDeleteLevelModal,
  setShowDeleteLevelModal,
  repositoryId,
  levelId,
  setIsEditMode,
  iconUrl,
}: DeleteLevelModalProps) {
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteLevel = async () => {
    setDeleting(true);
    try {
      await deleteLevelAction(repositoryId!, levelId!, iconUrl);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete level.",
      });
    } finally {
      setDeleting(false);
      setShowDeleteLevelModal(false);
      setIsEditMode(false);
    }
  };

  return (
    <Modal
      className="flex h-1/2 flex-col items-center justify-center"
      showModal={showDeleteLevelModal}
      setShowModal={setShowDeleteLevelModal}>
      <div className="flex flex-col items-center justify-center border-gray-200     px-4 py-4 pt-8 sm:px-16">
        <h3 className="text-center text-lg font-medium">Are you sure you want to delete this level?</h3>
        <p className="text-center text-sm text-gray-500">
          This action cannot be undone and will permanently delete this level
        </p>
      </div>

      <div className="flex w-full flex-col    px-4 py-8 text-left sm:px-16">
        <Button onClick={handleDeleteLevel} variant="destructive" loading={deleting}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export function useDeleteLevelModal(repositoryId: string, levelId: string, setIsEditMode, iconUrl: string) {
  const [showDeleteLevelModal, setShowDeleteLevelModal] = useState(false);

  const DeleteLevelModalCallback = useCallback(() => {
    return (
      <DeleteLevelModal
        showDeleteLevelModal={showDeleteLevelModal}
        setShowDeleteLevelModal={setShowDeleteLevelModal}
        repositoryId={repositoryId}
        levelId={levelId}
        setIsEditMode={setIsEditMode}
        iconUrl={iconUrl}
      />
    );
  }, [showDeleteLevelModal, setShowDeleteLevelModal]);

  return useMemo(
    () => ({
      setShowDeleteLevelModal,
      DeleteLevelModal: DeleteLevelModalCallback,
    }),
    [setShowDeleteLevelModal, DeleteLevelModalCallback]
  );
}
