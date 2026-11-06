#!/bin/sh
# Remove every submission called "Test Plumbing Co" (D1 rows + KV preview/photos/live site) so test_e2e.py can run again.
set -e
cd "$(dirname "$0")/.."
export PATH=/workspace/tools/node-v22.11.0-linux-x64/bin:$PATH
IDS=$(npx wrangler d1 execute wod-db --remote --json --command "SELECT id FROM submissions WHERE name='Test Plumbing Co'" | python3 -c "import json,sys;print(' '.join(r['id'] for r in json.load(sys.stdin)[0]['results']))")
for ID in $IDS; do
  for k in $(npx wrangler kv key list --binding KV --remote --prefix "img:$ID" | python3 -c "import json,sys;print(' '.join(k['name'] for k in json.load(sys.stdin)))") pv:$ID; do npx wrangler kv key delete --binding KV --remote "$k" >/dev/null; done
  npx wrangler d1 execute wod-db --remote --command "DELETE FROM events WHERE sub_id='$ID'; DELETE FROM leads WHERE sub_id='$ID'; DELETE FROM submissions WHERE id='$ID';" >/dev/null
  echo "removed $ID"
done
npx wrangler kv key delete --binding KV --remote site:test-plumbing-co >/dev/null 2>&1 || true
npx wrangler d1 execute wod-db --remote --command "DELETE FROM rate; DELETE FROM events WHERE sub_id IS NULL;" >/dev/null
