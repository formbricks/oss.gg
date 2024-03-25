import { deleteUserAction } from "@/app/(dashboard)/settings/actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
}: {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  async function deleteAccount() {
    try {
      console.log("deleting");
      setDeleting(true);
      await deleteUserAction();
      signOut({
        callbackUrl: `${window.location.origin}/login`,
      });
    } catch (error) {
      toast({
        title: `Error deleting account`,
        description: error.message,
      });
    } finally {
      setDeleting(false);
    }
  }

  async function handleSubmit() {
    console.log("deleting");
    toast({
      title: `Deleting account`,
      variant: "destructive", 
    });
    await deleteAccount();
  }

  return (
    <Modal showModal={showDeleteAccountModal} setShowModal={setShowDeleteAccountModal}>
      <div className="flex flex-col items-center justify-center space-y-3  border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <h3 className="text-lg font-medium">Are you absolutely sure?</h3>
        <p className="text-center text-sm text-gray-500">
          This action cannot be undone. This will permanently delete your account and remove your data from
          our servers.
        </p>
      </div>

      <div
        className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <Button onClick={handleSubmit} variant="destructive" loading={deleting}>
          {" "}
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export function useDeleteAccountModal() {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const DeleteAccountModalCallback = useCallback(() => {
    return (
      <DeleteAccountModal
        showDeleteAccountModal={showDeleteAccountModal}
        setShowDeleteAccountModal={setShowDeleteAccountModal}
      />
    );
  }, [showDeleteAccountModal, setShowDeleteAccountModal]);

  return useMemo(
    () => ({
      setShowDeleteAccountModal,
      DeleteAccountModal: DeleteAccountModalCallback,
    }),
    [setShowDeleteAccountModal, DeleteAccountModalCallback]
  );
}
