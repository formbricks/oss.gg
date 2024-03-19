import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/use-toast";
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
    setDeleting(true);
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

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast({
            title: `deleting`,
            description: "Next steps to be built",
          });
          await deleteAccount();
        }}
        className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <Button variant="destructive" loading={deleting}>
          {" "}
          Delete
        </Button>
      </form>
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
