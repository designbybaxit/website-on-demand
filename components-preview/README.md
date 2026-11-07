# Kaito Counter component preview

Standalone fictional sushi-bar page. It is not part of the website-on-demand builder.

Open `public/index.html` in a browser. Nothing on the page is sent anywhere.

To publish the static preview from the box (existing OAuth, no new account):

```sh
cd components-preview
npx wrangler deploy
```

`wrangler.jsonc` names the Worker `wod-components-preview` and serves `./public` only. It has no D1, KV, or secrets. Do not deploy this config over `wod` or `wod-design-test`.
