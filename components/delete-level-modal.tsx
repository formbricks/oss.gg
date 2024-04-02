import { deleteUserAction } from "@/app/(dashboard)/settings/actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

function DeleteLevelModal({
  showDeleteLevelModal,
  setShowDeleteLevelModal,
}: {
  showDeleteLevelModal: boolean;
  setShowDeleteLevelModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  async function deleteLevel() {
    try {
      setDeleting(true);
      // await deleteUserAction();
      // signOut({
      //   callbackUrl: `${window.location.origin}/login`,
      // });
    } catch (error) {
      toast({
        title: `Error deleting level`,
        description: error.message,
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal showModal={showDeleteLevelModal} setShowModal={setShowDeleteLevelModal}>
      <div className="flex flex-col items-center justify-center space-y-3  border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <h3 className="text-lg font-medium">Are you sure you want to delete this level?</h3>
        <p className="text-center text-sm text-gray-500">
        This action cannot be undone and will permanently delete this level 
        </p>
      </div>

      <div className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <Button onClick={deleteLevel} variant="destructive" loading={deleting}>
          {" "}
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export function useDeleteLevelModal() {
  const [showDeleteLevelModal, setShowDeleteLevelModal] = useState(false);

  const DeleteLevelModalCallback = useCallback(() => {
    return (
      <DeleteLevelModal
      showDeleteLevelModal={showDeleteLevelModal}
      setShowDeleteLevelModal={setShowDeleteLevelModal}
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
