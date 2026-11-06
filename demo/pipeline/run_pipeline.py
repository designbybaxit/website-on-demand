"""
Website-on-demand backend shape (demo).

  intake JSON  ->  Builder bot   -> private/<id>/index.html   (agency only, never sent to client)
               ->  Preview bot   -> client/<id>/desktop.png, mobile.png, manifest.json  (only thing the client gets)

Usage:  python run_pipeline.py example_intake.json
Needs:  pip install playwright && playwright install chromium

In production: the intake bot is a webhook/email parser, generate_copy() calls an LLM,
private/ is a private bucket, and client/ PNGs are uploaded to a public URL or emailed.
"""
import html, json, sys, asyncio, datetime
from pathlib import Path
from playwright.async_api import async_playwright

HERE = Path(__file__).parent
PRIVATE, CLIENT = HERE / "private", HERE / "client"
BRAND = "SiteSpark"
e = html.escape


def generate_copy(d):
    """LLM HOOK: in the live version, send `d` to an LLM and return the same keys."""
    city = f" in {d['city']}" if d.get("city") else ""
    trade = d["industry"].split(" ")[0]
    names = [s["name"] for s in d["services"][:3]]
    return {
        "headline": f"{trade} you can rely on{city}",
        "sub": f"{', '.join(names)}, done properly by a friendly local team.",
        "cta": "Get a free quote",
        "why": [("Fast response", "We turn up when we say we will."),
                ("Fully insured", "Peace of mind on every job."),
                ("Clear pricing", "The price before we start. No surprises.")],
    }


def build_site(d, c):
    a = d.get("accent", "#2563eb")
    cards = "".join(f"<div class=sc><h3>{e(s['name'])}</h3><p>{e(s.get('desc',''))}</p><b>{e(s.get('price',''))}</b></div>" for s in d["services"])
    why = "".join(f"<div class=wi><b>✓ {e(t)}</b><span>{e(x)}</span></div>" for t, x in c["why"])
    hours = "".join(f"<div>{e(h)}</div>" for h in d.get("hours", []))
    return f"""<!DOCTYPE html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>{e(d['name'])}</title><style>
body{{margin:0;font:16px/1.6 system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a}}
.w{{max-width:1100px;margin:0 auto;padding:0 28px}} nav{{display:flex;justify-content:space-between;align-items:center;padding:18px 0}}
nav b{{font-size:20px}} .btn{{background:{a};color:#fff;padding:12px 22px;border-radius:12px;font-weight:700;display:inline-block}}
.hero{{padding:70px 0}} h1{{font-size:clamp(34px,6vw,58px);line-height:1.1;margin:0 0 16px}} .sub{{color:#475569;font-size:19px;max-width:620px}}
section{{padding:60px 0;border-top:1px solid #e2e8f0}} .alt{{background:#f8fafc}} h2{{font-size:34px;text-align:center;margin:0 0 30px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}}
.sc,.wi,.cc{{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:22px}} .sc b{{color:{a}}} .sc p{{color:#475569}}
.wi span{{display:block;color:#475569}} footer{{padding:24px 0;color:#64748b;font-size:13px;border-top:1px solid #e2e8f0}}
</style></head><body>
<div class=w><nav><b>{e(d['name'])}</b><span class=btn>Call {e(d['phone'])}</span></nav></div>
<div class="hero w"><h1>{e(c['headline'])}</h1><p class=sub>{e(c['sub'])}</p><span class=btn>{e(c['cta'])}</span></div>
<section class=alt><div class=w><h2>What we do</h2><div class=grid>{cards}</div></div></section>
<section><div class=w><h2>About us</h2><p class=sub style="margin:0 auto 24px">{e(d['about'])}</p><div class=grid>{why}</div></div></section>
<section class=alt><div class=w><h2>Get in touch</h2><div class=grid>
<div class=cc><b>Call or email</b><div>{e(d['phone'])}</div><div>{e(d['email'])}</div></div>
<div class=cc><b>Opening hours</b>{hours}</div><div class=cc><b>Find us</b><div>{e(d.get('address',''))}</div></div></div></div></section>
<footer><div class=w>© {datetime.date.today().year} {e(d['name'])} · Website by {BRAND}</div></footer></body></html>"""


WATERMARK_JS = """(brand) => {
  const o = document.createElement('div');
  o.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:' + document.documentElement.scrollHeight + 'px;pointer-events:none;overflow:hidden;z-index:99999';
  for (let y = 120; y < document.documentElement.scrollHeight; y += 320)
    for (let x = -200; x < innerWidth + 200; x += 520) {
      const s = document.createElement('div'); s.textContent = 'PREVIEW · ' + brand.toUpperCase();
      s.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:rotate(-30deg);font:900 44px system-ui;color:rgba(120,120,130,.16);white-space:nowrap`;
      o.appendChild(s);
    }
  document.body.appendChild(o);
}"""


async def preview(site_file: Path, out: Path):
    out.mkdir(parents=True, exist_ok=True)
    shots = {}
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        for name, vp, scale in [("desktop", {"width": 1280, "height": 800}, 1), ("mobile", {"width": 390, "height": 844}, 2)]:
            p = await b.new_page(viewport=vp, device_scale_factor=scale)
            await p.goto(site_file.resolve().as_uri())
            await p.evaluate(WATERMARK_JS, BRAND)          # watermark is added to the rendered page only, not the saved HTML
            path = out / f"{name}.png"
            await p.screenshot(path=str(path), full_page=True)
            shots[name] = path.name
            await p.close()
        await b.close()
    return shots


async def main(intake_path):
    d = json.loads(Path(intake_path).read_text(encoding="utf-8"))
    print(f"[intake bot]  received {d['id']} '{d['name']}' with {len(d['services'])} services")
    site_dir = PRIVATE / d["id"]; site_dir.mkdir(parents=True, exist_ok=True)
    site = site_dir / "index.html"
    site.write_text(build_site(d, generate_copy(d)), encoding="utf-8")
    print(f"[builder bot] wrote {site.relative_to(HERE)} ({site.stat().st_size} bytes) - private, agency only")
    out = CLIENT / d["id"]
    shots = await preview(site, out)
    (out / "manifest.json").write_text(json.dumps({"id": d["id"], "business": d["name"], "images": shots,
        "approve_url": f"https://example.invalid/approve/{d['id']}", "note": "Preview images only; source HTML stays in private/"}, indent=2))
    print(f"[preview bot] client folder {out.relative_to(HERE)} -> {sorted(p.name for p in out.iterdir())}")
    assert not any(p.suffix == ".html" for p in out.iterdir()), "HTML must never reach the client folder"


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else HERE / "example_intake.json"))
