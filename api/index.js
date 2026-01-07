import server from "../build/server/index.js";

// Vercel serverless function handler
export default async function handler(req) {
  // Convert Vercel's request to a Web Request if needed
  const request =
    req instanceof Request
      ? req
      : new Request(req.url, {
          method: req.method,
          headers: req.headers,
          body: req.body,
        });

  // The server might be a fetch function itself or have a fetch method
  const fetchHandler = typeof server === "function" ? server : server.fetch;

  if (!fetchHandler) {
    throw new Error("Server export does not have a fetch handler");
  }

  return await fetchHandler(request);
}
