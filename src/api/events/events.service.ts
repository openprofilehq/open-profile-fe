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
