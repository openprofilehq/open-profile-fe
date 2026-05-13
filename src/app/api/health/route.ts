export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
