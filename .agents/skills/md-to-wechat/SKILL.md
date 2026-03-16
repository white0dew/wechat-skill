---
name: md-to-wechat
description: Convert Markdown to WeChat-ready HTML and optionally automate the md2wechat web app plus WeChat Official Account backend via Chrome CDP. Use when the user asks to convert .md to WeChat HTML, copy rich text, select themes (including URL ?theme=), or auto-fill/save a WeChat draft.
---

# md-to-wechat

## Language

- Respond in the user's language.

## Resolve Base Directory

- Set `{baseDir}` to the directory containing this `SKILL.md`.

## Scripts

| Script | Purpose |
| --- | --- |
| `scripts/cdp_export.mjs` | Drive the web app + WeChat backend via CDP and copy/paste rich text |
| `scripts/run.mjs` | Thin wrapper around the CLI (`packages/cli`) |

## Non-negotiables

- Use Chrome CDP for browser automation; do not use `agent-browser` for this skill.
- Default to the "复制富文本" button path; only use selection copy when explicitly requested or the button fails.

## Prereqs

- Node.js available (`node`).
- md2wechat web app running (default `http://127.0.0.1:4173/#/`).
- Chrome/Edge with remote debugging enabled for `--cdp`, or allow `--launch-local` to start a local Chrome.
- Logged-in WeChat Official Account session if using `--wechat`.

## Quick start

CLI conversion:

```bash
node {baseDir}/scripts/run.mjs article.md --theme minimal --out wechat.html
```

CDP copy only:

```bash
node {baseDir}/scripts/cdp_export.mjs \
  --markdown-file "article.md" \
  --app "http://127.0.0.1:4173/#/" \
  --cdp "http://127.0.0.1:9222" \
  --action copy-rich
```

CDP + WeChat backend:

```bash
node {baseDir}/scripts/cdp_export.mjs \
  --markdown-file "article.md" \
  --app "http://127.0.0.1:4173/#/" \
  --cdp "http://127.0.0.1:9222" \
  --action copy-rich \
  --wechat
```

## Inputs and metadata

- Accept Markdown via `--markdown-file`, stdin, or `--markdown` text.
- Parse frontmatter: `title`, `author`, `summary`, `coverImage`, `featureImage`, `cover`, `image`.
- Allow CLI overrides: `--title`, `--author`, `--summary`, `--cover`.
- Default `--wechat` saves draft unless `--no-submit`.
- Default to mark original unless `--no-original`.

## Theme selection

- Add `?theme=<name>` to the app URL to preselect a theme.
- Support built-in themes plus locally saved theme drafts.
- See `references/theme-lab.md` for import/export format and naming rules.

## Timing and stability

- Use `--delay-scale` and `--jitter-ms` to slow down UI steps and add random jitter.
- Keep waits generous on WeChat backend UI transitions.

## Vendoring external deps

- If a script needs third-party packages, vendor them under `{baseDir}/scripts/vendor/` and reference via `file:` in `{baseDir}/scripts/package.json`.
- Keep vendor dependencies pinned and minimal.

## References

- `references/wechat-cdp.md`: CDP flow, selectors, and original declaration steps.
- `references/theme-lab.md`: theme draft import/export and URL selection rules.
- `references/troubleshooting.md`: common failure modes and fixes.
