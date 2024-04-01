"use client";

import { useDeleteAccountModal } from "@/components/delete-modal";
import { Button } from "@/components/ui/button";

export default function DeleteAccountCard() {
  const { setShowDeleteAccountModal, DeleteAccountModal } = useDeleteAccountModal();
  return (
    <div>
      <DeleteAccountModal />
      <div className="h-fit w-full space-y-3 rounded-lg bg-muted p-5 ">
        <p className="text-md">Danger Zone </p>
        <Button
          onClick={() => {
            setShowDeleteAccountModal(true);
          }}
          variant="destructive">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
