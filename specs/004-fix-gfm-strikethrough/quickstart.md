# Quickstart: Verify GFM Strikethrough Fix

**Feature**: 004-fix-gfm-strikethrough  
**Purpose**: Step-by-step verification that the fix is correct after implementation

## Prerequisites

- Node.js 20 LTS installed
- Repository cloned and on branch `004-fix-gfm-strikethrough`

## Step 1: Install the new dependency

```bash
npm install
```

Confirm `remark-gfm` appears in `node_modules/` and `package-lock.json` is updated.

## Step 2: Build the site

```bash
npm run build
```

Expected: Build completes with **zero errors or new warnings**. The `out/` directory is
populated with static HTML files.

## Step 3: Verify the affected post

Open the built HTML for the known-broken post:

```bash
grep -n 'framework' out/2017/10/28/there-is-no-such-thing-as-a-free-free-monad/index.html
```

Expected output should contain a `<del>` element (or `<s>` -- both are valid GFM output):

```html
<del>framework</del>
```

It must **not** contain literal tilde characters around "framework":

```html
~~framework~~ ← BAD: fix did not work
```

## Step 4: Spot-check posts with tilde characters (regression check)

Verify that posts using single tildes in prose are unaffected:

```bash
grep -n '~' out/2017/09/27/how--not--to-upgrade-to-asp-net-core-2-0-just-yet-with-paket/index.html | head -5
```

Expected: Lines contain `~&gt; 1` (HTML-escaped `~> 1`) or similar, with no `<del>` tags
introduced around version range tildes.

## Step 5: Visual verification (optional but recommended)

Start a local server to view the rendered output:

```bash
npx serve out
```

Navigate to the affected post and confirm:

- The word "framework" appears with a visible line-through decoration
- No raw `~~` characters are visible anywhere on the page
- All other formatting (bold, italic, links, code blocks) renders correctly

## Success Criteria Checklist

- [ ] **SC-001**: `~~framework~~` in the "Free Monad" post renders with line-through
- [ ] **SC-002**: Build succeeds with zero new errors or warnings
- [ ] **SC-003**: No `~~` literal characters visible in any rendered post
- [ ] **SC-004**: Posts with single tildes (version ranges `~> 1`, paths `~EWD/`) render unchanged
- [ ] **SC-005** (optional): A new test post with GFM table and task list renders correctly
