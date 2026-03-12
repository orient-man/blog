# Indonezja Blog Restore — Design

## Source Analysis

### Platform
- **CuteNews 1.4.6** — flat-file PHP blog system with XHTML 1.0 output
- **Author**: Marcin Malinowski (`malin@piatka.pl` / `orientman@gmail.com`)
- **Title**: "Blog indonezyjski Marcina M."
- **Trip dates**: March 1 – April 1, 2004

### Route
Warsaw → Amsterdam → Jakarta → Yogyakarta → Borobudur → Manado → Siladen → Bunaken → Bali/Denpasar → Ubud → Kuta → Lombok/Sengigi → Gili Trawangan → Gili Air → Singapore → home

### Wayback Machine Sources
| Resource | URL |
|----------|-----|
| Homepage (posts 1–10) | `https://web.archive.org/web/20040705111433/http://indonezja.piatka.pl/` |
| Page 2 (posts 11–16) | `https://web.archive.org/web/20040705150312/http://indonezja.piatka.pl:80/index.php?start_from=10` |
| Photo gallery | `https://web.archive.org/web/20040705111510/http://indonezja.piatka.pl:80/img/` |

## Content Recovery

### Post Inventory

| # | Title | Date | Content | Inline Image |
|---|-------|------|---------|--------------|
| 1 | Prima aprilis bez żartów | 2004-04-01 | FULL | emoticon only |
| 2 | Gili, gili rekinku | 2004-03-27 | SUMMARY | small5_02.jpg |
| 3 | Wolniej i wolniej | 2004-03-26 | SUMMARY | small5_00b.jpg |
| 4 | Kuta raj utracony albo ślady stóp na ścianie | 2004-03-26 | SUMMARY | small4_31.jpg |
| 5 | Na jednym oddechu... | 2004-03-23 | FULL | none |
| 6 | A Night At The Opera | 2004-03-20 | SUMMARY | small4_00a.jpg |
| 7 | Szczekanie Baronga | 2004-03-17 | SUMMARY | small3_19.jpg |
| 8 | Bunaken - Manado - Surabaya - Denpasar | 2004-03-11 | SUMMARY | small2_24.jpg |
| 9 | Manado - Siladen - Bunaken | 2004-03-08 | SUMMARY | small2_16.jpg |
| 10 | Selamat pagi | 2004-03-05 | SUMMARY | small3_17.jpg |
| 11 | Manado, czyli wreszcie w buszu | 2004-03-04 | SUMMARY | small1_21.jpg |
| 12 | Yogya by night | 2004-03-03 | SUMMARY | none |
| 13 | Pierwszy przystanek | 2004-03-01 | FULL | none |
| 14 | Spakowany! | 2004-03-01 | SUMMARY | none |
| 15 | Przygotowania trwają | 2004-02-27 | FULL | spp.jpg |
| 16 | Przydatne odnośniki | 2004-02-22 | FULL | none (links) |

**FULL** = complete post text recovered (5 posts).
**SUMMARY** = only the CuteNews summary/excerpt was archived; full text lost (11 posts).

Summary-only posts include a Polish disclaimer:
> *Pełny tekst tego wpisu nie zachował się w archiwach internetowych. Poniżej znajduje się zachowany fragment.*

### Photo Gallery (57 photos, 5 sections)

Photos organized by location with Polish captions (corrected from ISO-8859-2 mojibake in the Wayback HTML):

1. **Warszawa, Borobudur, Yogyakarta** — 11 photos (IDs: 1_00 through 1_35)
2. **Manado, Siladen** — 9 photos (IDs: 2_00a through 2_24)
3. **Bunaken, Manado, Bali, Ubud** — 15 photos (IDs: 3_02 through 3_35)
4. **Ubud, świątynie Bali, Tanahlot, Dreamland** — 15 photos (IDs: 4_00a through 4_31)
5. **Gili Trawangan, Gili Air, Lombok** — 7 photos (IDs: 5_00a through 5_13)

Three sizes existed per photo in the original: `thumb{id}.jpg`, `small{id}.jpg`, `{id}.jpg` (full-size).
The best available version was downloaded for each.

## Image Recovery

### Gallery Photos — Recovery Results

| Status | Count | Details |
|--------|-------|---------|
| Downloaded | 51 | Mix of full-size (7), small (~9), and thumbnail (~35) quality |
| Unavailable | 7 | No Wayback capture at any size |

**Missing gallery photos** (commented out in gallery MDX with captions preserved):
- `1_00.jpg` — Warszawa: Gdzie ty jedziesz?!
- `4_00a.jpg` — Ubud: Ketut i Saban
- `4_02.jpg` — Bali: Świątynia (2)
- `4_26.jpg` — Dreamland: Ja i Aga
- `5_01.jpg` — Gili Trawangan: Onasis zabawia dziewczęta
- `5_02.jpg` — Gili Air: Żywy po spotkaniu z rekinami
- `5_13.jpg` — I promem na Bali

### Per-Post Inline Images — Recovery Results

| File | Post | CDX Timestamp | Status |
|------|------|---------------|--------|
| small1_21.jpg | manado-czyli-wreszcie-w-buszu | — | Copied from gallery (1_21.jpg thumbnail) |
| small2_16.jpg | manado-siladen-bunaken | 20050618021234 | Downloaded |
| small2_24.jpg | bunaken-manado-surabaya-denpasar | 20050618021230 | Downloaded |
| small3_17.jpg | selamat-pagi | 20050618021209 | Downloaded |
| small3_19.jpg | szczekanie-baronga | 20050618021205 | Downloaded |
| small4_00a.jpg | a-night-at-the-opera | 20050618021226 | Downloaded |
| small4_31.jpg | kuta-raj-utracony | 20050618021202 | Downloaded |
| small5_00b.jpg | wolniej-i-wolniej | 20050618021157 | Downloaded |
| small5_02.jpg | gili-gili-rekinku | 20050618021221 | Downloaded |
| spp.jpg | przygotowania-trwaja | — | NOT available (no Wayback capture) |

## Content Transformations

### Emoticon Conversion
CuteNews stored emoticons as inline images (`data/emoticons/*.gif`).
These were converted to Unicode emoji:
- `crying.gif` → 😢
- `wink.gif` → 😉
- `smile.gif` → 😊
- `sad.gif` → 😢
- `tongue.gif` → 😛

### Character Encoding Fix
Gallery captions were stored as ISO-8859-2 (Polish Windows encoding) but served as UTF-8 by the Wayback Machine, producing mojibake.
Examples of corrections:
- `¦wi±tynia` → `Świątynia`
- `Dzie?? dobry` → `Dzień dobry`
- `Kadid¿a` → `Kadidża`

### Frontmatter Schema

All posts use existing frontmatter fields — no schema extension needed:
```yaml
title: "Post title"
date: YYYY-MM-DD
author: orientman
slug: indonezja-{kebab-case}
wordpressUrl: ""
externalLinks:
  - label: "Wayback Machine"
    url: https://web.archive.org/web/...
category: wpisy-po-polsku
tags:
  - travel
  - indonezja
format: standard
```

## File Structure

### MDX Posts (17 files in `content/posts/`)
```
indonezja-przydatne-odnosniki.mdx        # 2004-02-22
indonezja-przygotowania-trwaja.mdx        # 2004-02-27
indonezja-spakowany.mdx                   # 2004-03-01
indonezja-pierwszy-przystanek.mdx         # 2004-03-01
indonezja-yogya-by-night.mdx              # 2004-03-03
indonezja-manado-czyli-wreszcie-w-buszu.mdx  # 2004-03-04
indonezja-selamat-pagi.mdx                # 2004-03-05
indonezja-manado-siladen-bunaken.mdx      # 2004-03-08
indonezja-bunaken-manado-surabaya-denpasar.mdx  # 2004-03-11
indonezja-szczekanie-baronga.mdx          # 2004-03-17
indonezja-a-night-at-the-opera.mdx        # 2004-03-20
indonezja-na-jednym-oddechu.mdx           # 2004-03-23
indonezja-kuta-raj-utracony.mdx           # 2004-03-26
indonezja-wolniej-i-wolniej.mdx           # 2004-03-26
indonezja-gili-gili-rekinku.mdx           # 2004-03-27
indonezja-prima-aprilis-bez-zartow.mdx    # 2004-04-01
indonezja-2004-galeria.mdx               # 2004-04-02 (gallery)
```

### Image Directories (11 directories under `public/images/posts/`)
```
indonezja-2004-galeria/           # 51 gallery photos
indonezja-a-night-at-the-opera/   # small4_00a.jpg
indonezja-bunaken-manado-surabaya-denpasar/  # small2_24.jpg
indonezja-gili-gili-rekinku/      # small5_02.jpg
indonezja-kuta-raj-utracony/      # small4_31.jpg
indonezja-manado-czyli-wreszcie-w-buszu/     # small1_21.jpg
indonezja-manado-siladen-bunaken/ # small2_16.jpg
indonezja-selamat-pagi/           # small3_17.jpg
indonezja-szczekanie-baronga/     # small3_19.jpg
indonezja-wolniej-i-wolniej/      # small5_00b.jpg
```

## Recovery Process

### Steps Taken

1. **Platform identification** — Recognized CuteNews 1.4.6 from HTML source; identified all Wayback snapshots via CDX API.
2. **NAS search** — Exhaustively searched local NAS for any CuteNews data backups; none found.
3. **CDX index analysis** — Fetched complete CDX index from `web.archive.org/cdx/search/cdx?url=indonezja.piatka.pl/*` to map all available snapshots and image timestamps.
4. **HTML extraction** — Fetched raw HTML from both blog pages and parsed all 16 posts (titles, dates, content, inline images).
5. **Gallery extraction** — Fetched gallery HTML, parsed all 57 photo entries with captions, corrected ISO-8859-2 mojibake to proper Polish UTF-8.
6. **Photo download** — Downloaded gallery photos using CDX timestamps for best available quality (full > small > thumb). Created bash script for batch download with retry logic.
7. **MDX creation** — Wrote 17 MDX files following existing blog conventions (frontmatter schema, image paths, clickable image pattern).
8. **Inline image download** — Created and ran second script for per-post inline images.
9. **Missing image handling** — Removed broken references to unavailable images (spp.jpg), commented out 7 missing gallery entries preserving captions.
10. **Validation** — Lint clean, build successful (206 static pages).

### Tools Used
- Wayback Machine CDX API for snapshot discovery
- `curl` with CDX timestamps for deterministic image downloads
- Manual HTML parsing from Wayback snapshots
- Next.js build pipeline for validation

### What Was Lost
- **11 of 16 post bodies** — CuteNews stored full text separately from summaries; Wayback only captured the homepage which showed summaries. Full text was only available for 5 posts that had short enough content to appear in full on the homepage.
- **7 of 57 photos** — These images had no Wayback capture at any resolution.
- **1 screenshot** (`spp.jpg`) — Sprzefak++ application screenshot, no archive capture.
- **Comments** — CuteNews comment pages were captured but not imported (low value, mostly test comments).
