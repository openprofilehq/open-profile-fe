import { callApi } from "@/api/base";

export type RecordProfileViewRequest = {
  username: string;
  src?: string;
  referrerSearchId?: string;
  referrer?: string;
};

export type RecordProfileViewResponse = {
  recorded: boolean;
};

export function recordProfileView(data: RecordProfileViewRequest) {
  return callApi<RecordProfileViewResponse>({
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

export type RecordLinkClickResponse = {
  recorded: boolean;
};

export function recordLinkClick(data: RecordLinkClickRequest) {
  return callApi<RecordLinkClickResponse>({
    url: "/events/link-click",
    method: "POST",
    data,
    silent: true,
  });
}
