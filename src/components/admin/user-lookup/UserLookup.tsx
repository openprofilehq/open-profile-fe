"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { userSearchQueryOptions } from "@/api/admin/admin.lookup.options";
import {
  performUserAction,
  type LookupUser,
  type UserActionType,
} from "@/api/admin/admin.service";
import UserResultCard from "./UserResultCard";
import UserManagePanel from "./UserManagePanel";
import { ActionModal } from "./ActionModals";

function EmptyState() {
  return (
    <div className="bg-secondary-bg border-tertiary-b flex items-center justify-center rounded-[8px] border py-14">
      <p className="text-tertiary-text text-center text-sm">
        Search for a user to view their profile and manage their account.
      </p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="border-tertiary-b flex flex-col items-center justify-center rounded-[8px] border py-14">
      <div className="bg-brand-subtle-bg mb-4 flex h-12 w-12 items-center justify-center rounded-full">
        <Search size={22} className="text-brand-text" aria-hidden="true" />
      </div>
      <p className="text-primary-text mb-1 text-sm font-semibold">
        No results found
      </p>
      <p className="text-tertiary-text text-sm">
        We couldn&apos;t find anyone matching &ldquo;{query}&rdquo;.
      </p>
      <p className="text-tertiary-text text-sm">
        Try a different name or username.
      </p>
    </div>
  );
}

function SearchingState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div
        className="border-brand-bg mb-4 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
        role="status"
        aria-label={`Searching for ${query}`}
      />
      <p className="text-primary-text text-sm font-semibold">
        Searching for {query}
      </p>
      <p className="text-tertiary-text mt-1 text-sm">
        Looking through thousands of profiles…
      </p>
    </div>
  );
}

export default function UserLookup() {
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedUser, setSelectedUser] = useState<LookupUser | null>(null);
  const [pendingAction, setPendingAction] = useState<UserActionType | null>(
    null
  );

  const { data, isFetching, isSuccess } = useQuery(
    userSearchQueryOptions(committedQuery)
  );

  const users = data?.users ?? [];
  const hasQuery = committedQuery.trim().length > 0;
  const hasResults = isSuccess && users.length > 0;
  const noResults = isSuccess && users.length === 0 && hasQuery;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (val.trim() === "") {
        setCommittedQuery("");
        setSelectedUser(null);
        return;
      }

      debounceRef.current = setTimeout(() => {
        setCommittedQuery(val.trim());
        setSelectedUser(null);
      }, 400);
    },
    []
  );

  const actionMutation = useMutation({
    mutationFn: ({
      userId,
      action,
    }: {
      userId: string;
      action: UserActionType;
    }) => performUserAction(userId, action),
    onSuccess: (_, { action }) => {
      const messages: Record<UserActionType, string> = {
        suspend: "User suspended successfully.",
        block: "User blocked successfully.",
        deactivate: "Account deactivated.",
        flag: "User flagged for review.",
        reactivate: "Account reactivated.",
      };
      toast.success(messages[action], {
        action: { label: "Undo", onClick: () => {} },
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "user-lookup"] });
      setPendingAction(null);
      setSelectedUser(null);
    },
    onError: () => {
      toast.error("Action failed. Please try again.");
      setPendingAction(null);
    },
  });

  function handleConfirmAction() {
    if (!pendingAction || !selectedUser) return;
    actionMutation.mutate({ userId: selectedUser.id, action: pendingAction });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-primary-text text-xl font-semibold">User Lookup</h1>
        <p className="text-secondary-text mt-0.5 text-sm">
          Search and manage user accounts across Open.Profile.
        </p>
      </div>

      <div className="relative">
        <input
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search by name or username"
          aria-label="Search users"
          className={cn(
            "border-tertiary-b bg-card text-primary-text placeholder:text-tertiary-text",
            "w-full rounded-[8px] border px-4 py-2.5 text-sm transition-colors outline-none",
            inputValue.trim().length > 0
              ? "bg-card-selected-bg"
              : "focus:bg-card-selected-bg"
          )}
        />
      </div>

      {hasResults && (
        <p className="text-secondary-text text-sm">
          Found{" "}
          <span className="text-primary-text font-medium">{users.length}</span>{" "}
          {users.length === 1 ? "result" : "results"} for &ldquo;
          {committedQuery}&rdquo;
        </p>
      )}

      {!hasQuery && <EmptyState />}
      {hasQuery && isFetching && <SearchingState query={committedQuery} />}
      {noResults && !isFetching && <NoResults query={committedQuery} />}

      {hasResults && !isFetching && (
        <div
          className={cn(
            "grid gap-4",
            selectedUser ? "grid-cols-1 lg:grid-cols-[1fr_2fr]" : "grid-cols-1"
          )}
        >
          <ul className={cn("space-y-3", selectedUser && "hidden lg:block")}>
            {(selectedUser
              ? users.filter((u) => u.id === selectedUser.id)
              : users
            ).map((user) => (
              <li key={user.id}>
                <UserResultCard
                  user={user}
                  isSelected={selectedUser?.id === user.id}
                  onManage={() =>
                    setSelectedUser((prev) =>
                      prev?.id === user.id ? null : user
                    )
                  }
                />
              </li>
            ))}
          </ul>

          {selectedUser && (
            <div className="lg:sticky lg:top-6 lg:self-start">
              <UserManagePanel
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onRequestAction={(action) => setPendingAction(action)}
                actionPending={actionMutation.isPending}
              />
            </div>
          )}
        </div>
      )}

      {pendingAction && selectedUser && (
        <ActionModal
          action={pendingAction}
          user={selectedUser}
          onConfirm={handleConfirmAction}
          onCancel={() => setPendingAction(null)}
          isPending={actionMutation.isPending}
        />
      )}
    </div>
  );
}
