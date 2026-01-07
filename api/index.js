import server from "../build/server/index.js";

// Vercel serverless function handler
export default async function handler(req) {
  // Debug: log what we got from the import
  console.log("Server type:", typeof server);
  console.log("Server keys:", Object.keys(server || {}));
  console.log("Server.fetch type:", typeof server?.fetch);
  console.log("Server.handler type:", typeof server?.handler);
  console.log("Server.request type:", typeof server?.request);

  // Build a complete URL from Vercel's request
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host =
    req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = `${protocol}://${host}${req.url || "/"}`;

  // Convert to Web Request
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });

  // Try different possible handler methods
  const fetchHandler =
    typeof server === "function"
      ? server
      : server?.fetch
      ? server.fetch.bind(server)
      : server?.handler
      ? server.handler.bind(server)
      : server?.request
      ? server.request.bind(server)
      : null;

  if (!fetchHandler) {
    return new Response(
      JSON.stringify({
        error: "Server export does not have a fetch handler",
        serverType: typeof server,
        serverKeys: Object.keys(server || {}),
        serverPrototype: Object.getPrototypeOf(server)?.constructor?.name,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return await fetchHandler(request);
}
