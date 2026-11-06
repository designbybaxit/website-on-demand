-- Website on Demand, D1 schema (phase 1)
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,              -- random, unguessable; also the preview id (/p/<id>)
  token_hash TEXT NOT NULL,         -- SHA-256 of the client's write token
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL,             -- previewing | applied | published | unpublished
  name TEXT, slug TEXT, email TEXT, phone TEXT, country TEXT, industry TEXT,
  data_json TEXT,                   -- all form fields (photos/logo as /i/ URLs, never inline)
  opts_json TEXT,                   -- chosen style / colour / dark / headline
  version INTEGER DEFAULT 0,
  revisions_json TEXT,              -- change requests
  placeholders_json TEXT,           -- "before launch" list
  style_key TEXT,
  preview_expires_at TEXT,
  preview_opens INTEGER DEFAULT 0,
  img_count INTEGER DEFAULT 0,
  apply_json TEXT,                  -- Apply now: email, domain choice, price shown
  applied_at TEXT,
  paid_json TEXT,                   -- provider, reference, amount, currency, at
  published_slug TEXT,
  published_at TEXT,
  ip TEXT, ip_country TEXT
);
CREATE INDEX IF NOT EXISTS sub_created ON submissions(created_at);
CREATE INDEX IF NOT EXISTS sub_slug ON submissions(published_slug);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sub_id TEXT, at TEXT NOT NULL, type TEXT NOT NULL, detail TEXT
);
CREATE INDEX IF NOT EXISTS ev_sub ON events(sub_id, id);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT, sub_id TEXT, at TEXT NOT NULL, data_json TEXT, ip TEXT
);
CREATE TABLE IF NOT EXISTS rate (k TEXT PRIMARY KEY, n INTEGER NOT NULL, exp INTEGER NOT NULL);
