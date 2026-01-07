import server from "../build/server/index.js";

// Hono server's fetch method
export default async (req, ctx) => {
  return server.fetch(req, ctx);
};
