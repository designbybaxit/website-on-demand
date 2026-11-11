/* Static-asset worker for wod-site-test only. No D1, KV, or production data.
   Serves the marketing-website experiment. Do not deploy as wod or wod-brand-preview. */
export default {
  async fetch(req, env) {
    return env.ASSETS.fetch(req);
  }
};
