import serverPromise from "../build/server/index.js";

let serverInstance = null;

export default {
  async fetch(request) {
    if (!serverInstance) {
      serverInstance = await serverPromise;
    }

    return await serverInstance.fetch(request);
  },
};
