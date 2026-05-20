import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const apiUrl = `${env.API_BASE_URL}/uploads/project-image-url`;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const contentType = response.headers.get("content-type") || "application/json";

  return new NextResponse(text, {
    status: response.status,
    headers: {
      "content-type": contentType,
    },
  });
}
