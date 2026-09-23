"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isApiError } from "@/api/base";
import {
  updateEmailOption,
  userSettingsQueryOptions,
} from "@/api/users/users.options";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail?: string;
};

export default function UpdateEmailDialog({
  open,
  onOpenChange,
  currentEmail,
}: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...updateEmailOption,
    onSuccess: (data) => {
      toast.success(`Email updated to ${data.email}.`);
      queryClient.invalidateQueries({
        queryKey: userSettingsQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setEmail("");
      setError(null);
      onOpenChange(false);
    },
    onError: (err) =>
      setError(isApiError(err) ? err.message : "Could not update your email."),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    mutation.mutate({ email: email.trim().toLowerCase() });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setEmail("");
          setError(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update email address</DialogTitle>
          <DialogDescription>
            {currentEmail
              ? `Your account currently uses ${currentEmail}.`
              : "Enter the address you want to use for this account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-label-text text-sm font-medium">
              New email address
            </label>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Update email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
