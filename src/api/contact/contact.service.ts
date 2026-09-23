import { callApiServer } from "@/api/base/base.server";

export type ContactRequest = {
  name: string;
  email: string;
  industry?: string;
  message: string;
};

export async function contactApi(data: ContactRequest) {
  return callApiServer({
    url: "/contact",
    method: "POST",
    data,
  });
}
