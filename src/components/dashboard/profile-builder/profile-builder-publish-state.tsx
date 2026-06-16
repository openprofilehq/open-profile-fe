"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type PublishStatus = "idle" | "publishing" | "published";

type ProfileBuilderPublishStateContextValue = {
  hasUnpublishedChanges: boolean;
  publishStatus: PublishStatus;
  publishedVersion: number;
  setHasUnpublishedChanges: (hasChanges: boolean) => void;
  setPublishStatus: (status: PublishStatus) => void;
  markProfilePublished: () => void;
};

const ProfileBuilderPublishStateContext =
  createContext<ProfileBuilderPublishStateContextValue | null>(null);

export function ProfileBuilderPublishStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hasUnpublishedChanges, setHasUnpublishedChangesState] =
    useState(false);
  const [publishStatus, setPublishStatusState] =
    useState<PublishStatus>("idle");
  const [publishedVersion, setPublishedVersion] = useState(0);
  const publishedResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const clearPublishedResetTimer = useCallback(() => {
    if (publishedResetTimerRef.current) {
      clearTimeout(publishedResetTimerRef.current);
      publishedResetTimerRef.current = null;
    }
  }, []);

  const setHasUnpublishedChanges = useCallback(
    (hasChanges: boolean) => {
      setHasUnpublishedChangesState(hasChanges);

      if (hasChanges) {
        clearPublishedResetTimer();
        setPublishStatusState("idle");
      }
    },
    [clearPublishedResetTimer]
  );

  const setPublishStatus = useCallback(
    (status: PublishStatus) => {
      clearPublishedResetTimer();
      setPublishStatusState(status);
    },
    [clearPublishedResetTimer]
  );

  const markProfilePublished = useCallback(() => {
    clearPublishedResetTimer();
    setHasUnpublishedChangesState(false);
    setPublishStatusState("published");
    setPublishedVersion((currentVersion) => currentVersion + 1);

    publishedResetTimerRef.current = setTimeout(() => {
      setPublishStatusState("idle");
      publishedResetTimerRef.current = null;
    }, 1800);
  }, [clearPublishedResetTimer]);

  useEffect(() => clearPublishedResetTimer, [clearPublishedResetTimer]);

  const value = useMemo(
    () => ({
      hasUnpublishedChanges,
      publishStatus,
      publishedVersion,
      setHasUnpublishedChanges,
      setPublishStatus,
      markProfilePublished,
    }),
    [
      hasUnpublishedChanges,
      publishStatus,
      publishedVersion,
      setHasUnpublishedChanges,
      setPublishStatus,
      markProfilePublished,
    ]
  );

  return (
    <ProfileBuilderPublishStateContext.Provider value={value}>
      {children}
    </ProfileBuilderPublishStateContext.Provider>
  );
}

export function useProfileBuilderPublishState() {
  const context = useContext(ProfileBuilderPublishStateContext);

  if (!context) {
    throw new Error(
      "useProfileBuilderPublishState must be used within ProfileBuilderPublishStateProvider"
    );
  }

  return context;
}
