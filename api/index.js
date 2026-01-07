import serverPromise from "../build/server/index.js";

// Cache the resolved server instance
let serverInstance = null;

// Vercel Functions format: export an object with a fetch method
export default {
  async fetch(request) {
    // Resolve and cache the server instance on first request
    if (!serverInstance) {
      serverInstance = await serverPromise;
    }

    // Build a complete URL if needed
    const url = request.url.startsWith("http")
      ? request.url
      : `https://${request.headers.get("host") || "localhost"}${request.url}`;

    // Create a proper Web Request
    const req = new Request(url, {
      method: request.method,
      headers: request.headers,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? request.body
          : undefined,
    });

    // Call the Hono server's fetch method
    return await serverInstance.fetch(req);
  },
};
