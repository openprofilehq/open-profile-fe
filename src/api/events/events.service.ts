import { callApi } from "@/api/base";

export type RecordProfileViewRequest = {
  username: string;
  src?: string;
  referrerSearchId?: string;
  referrer?: string;
};

export function recordProfileView(data: RecordProfileViewRequest) {
  return callApi<{ recorded: boolean }>({
    url: "/events/profile-view",
    method: "POST",
    data,
    silent: true,
  });
}

export type RecordLinkClickRequest = {
  username: string;
  linkUrl: string;
};

export function recordLinkClick(data: RecordLinkClickRequest) {
  return callApi<{ recorded: boolean }>({
    url: "/events/link-click",
    method: "POST",
    data,
    silent: true,
  });
}
