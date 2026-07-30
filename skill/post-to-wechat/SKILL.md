---
name: post-to-wechat
description: Convert Markdown to WeChat-ready HTML and save WeChat Official Account drafts. Route standard articles through the md2wechat web app and Chrome CDP, elaborate visual layouts through the bundled gzh-design skill, non-original API drafts through publish_draft.mjs, and original declarations through CDP.
---

# post-to-wechat

Respond in the user's language. Set `{baseDir}` to the directory containing this file.

## Route the request

Choose exactly one content-production route, then use the appropriate draft transport:

1. **Standard layout and normal publishing:** use `scripts/cdp_export.ts`. This is the default for Markdown conversion, theme selection, rich-text copy, metadata entry, cover upload, and saving a draft through the real WeChat backend.
2. **Elaborate visual layout:** read and follow `{baseDir}/../gzh-design/SKILL.md`. Use its themes, components, normalization, and validation to produce a clean HTML fragment. Do not replace its component rules with the standard md2wechat themes.
3. **Non-original API draft:** after a clean HTML fragment exists, use `scripts/publish_draft.mjs`. This path creates a draft only. It does not preview, mass-send, or declare originality.
4. **Original declaration:** always use the CDP/WeChat backend path. The API adapter is explicitly non-original and must not be used as a substitute for the declaration UI.

An elaborate layout may be transported by the API only when the article is non-original. If it must be declared original, keep the gzh-designed fragment as the content artifact and complete the declaration through the CDP backend workflow.

## Scripts

| Script | Purpose |
| --- | --- |
| `scripts/cdp_export.ts` | Drive the md2wechat web app and WeChat backend through Chrome CDP |
| `scripts/publish_draft.mjs` | Wrap an HTML fragment and create a non-original API draft through vendored runtime |

## Standard CDP workflow

- Use Chrome CDP for browser automation; do not use `agent-browser` for this skill.
- Default app: `https://wechat.reshub.vip`. Do not start a local server unless the user asks for local development or debugging.
- Default to the website's “复制富文本” button. Use selection copy only when explicitly requested or the button fails.
- With `--wechat`, fill available metadata and save the draft by default.
- Original declaration is enabled by default; use `--no-original` only when the user requests a non-original UI draft.

```bash
node {baseDir}/scripts/cdp_export.ts \
  --markdown-file "article.md" \
  --app "https://wechat.reshub.vip/?theme=default" \
  --cdp "http://127.0.0.1:9222" \
  --action copy-rich \
  --wechat \
  --title "Article title" \
  --author "Author" \
  --summary "Summary" \
  --cover "cover.png"
```

Relevant flags: `--theme`, `--app`, `--cdp`, `--launch-local`, `--wechat`, `--title`, `--author`, `--summary`, `--cover`, `--no-submit`, `--no-original`, `--delay-scale`, `--jitter-ms`, and `--copy-strategy selection`.

See `references/wechat-cdp.md`, `references/theme-lab.md`, and `references/troubleshooting.md`.

## Non-original API draft workflow

Use only after the user has asked to save a draft and the article does not require an original declaration.

```bash
node {baseDir}/scripts/publish_draft.mjs \
  --html "article-fragment.html" \
  --title "Article title" \
  --author "Author" \
  --summary "Summary" \
  --cover "cover.png" \
  --dry-run
```

- `--html` is mandatory.
- Remove `--dry-run` only when a real draft should be created.
- Credentials resolve from the process environment first, then `{baseDir}/.baoyu-skills/.env`.
- This script may create a draft. It must never preview, declare originality, or mass-send.
- See `references/api-draft-publish.md` for options and credential setup.

## Prerequisites

- Node.js 24+ for `scripts/cdp_export.ts` and `scripts/publish_draft.mjs`.
- Chrome or Edge remote debugging and a logged-in WeChat Official Account session for CDP publishing.
- WeChat API credentials and an allowed source IP for API drafts.
- The API adapter invokes `npx -y bun` without a shell and uses the vendored runtime under `scripts/vendor/`.

## Report the result

State the route and script used. Report only outcomes actually completed: generated HTML, copied rich text, metadata filled, cover uploaded, original declaration completed, or draft saved. For failures, name the exact failed step and whether the content artifact remains usable.
