import server from "../build/server/index.js";

// Vercel serverless function handler
export default async function handler(req) {
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

  // The server might be a fetch function itself or have a fetch method
  const fetchHandler = typeof server === "function" ? server : server.fetch;

  if (!fetchHandler) {
    throw new Error("Server export does not have a fetch handler");
  }

  return await fetchHandler(request);
}
