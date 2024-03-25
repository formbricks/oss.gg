"use client";

import { useDeleteAccountModal } from "@/components/delete-modal";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

export default function DeleteAccountCard() {
  const { setShowDeleteAccountModal, DeleteAccountModal } = useDeleteAccountModal();
  return (
    <div>
      <DeleteAccountModal />
      <div className="h-fit w-full space-y-3 rounded-lg bg-zinc-50 p-5 ">
        <p className="text-md font-bold">Account </p>
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
