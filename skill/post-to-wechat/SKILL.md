---
name: post-to-wechat
description: Publish an already formatted, WeChat-compatible HTML file to a WeChat Official Account draft. Use for HTML-to-draft publishing only; do not use this skill to convert Markdown to HTML or choose article themes.
---

# post-to-wechat

## Language

- Respond in the user's language.

## Scope and boundary

This skill is the **delivery step only**:

```text
already formatted HTML
  -> upload body images and cover
  -> save a WeChat Official Account draft
```

- Input must be an already formatted HTML file or fragment with element-level inline styles.
- This skill does **not** convert Markdown to HTML, select themes, open `wechat.reshub.vip`, or generate a visual layout.
- Generate the HTML beforehand with `gzh-design`, the Web editor, or another renderer. The publishing input must be the resulting HTML artifact.
- Do not replace the supplied HTML with a generic Markdown rendering result.

## Resolve Base Directory

- Set `{baseDir}` to the directory containing this `SKILL.md`.

## Scripts

| Script | Purpose |
| --- | --- |
| `scripts/publish_draft.mjs` | Publish an already formatted HTML file as a normal, non-original API draft |
| `scripts/cdp_export.ts` | Existing CDP helper retained for the legacy browser/backend workflow; it is **not** the HTML API publishing path defined by this skill |

## Choose the publishing path

1. **Normal non-original draft:** use `scripts/publish_draft.mjs`.
2. **Original declaration required:** do not use the API adapter as a substitute. Use the logged-in WeChat Official Account backend and complete the original-declaration UI before saving the draft. The existing `cdp_export.ts` is retained for the legacy browser flow, but this HTML-only skill does not ask it to render Markdown.

An API response with a `media_id` proves that a normal draft was created. It does **not** prove that an original declaration was made.

## HTML contract

Before publishing, require all of the following:

- A readable, non-empty `--html` file.
- WeChat-compatible HTML with element-level `style="..."` attributes. Do not rely on `<style>` blocks, scripts, CSS classes, or browser-only layout behavior that WeChat removes.
- A title, supplied with `--title` or present in the HTML `<title>`/`<h1>`.
- A cover image for a `news` draft, supplied with `--cover` when the account requires one.
- Public absolute URLs for remote body images, or paths that the publishing machine can actually read.

Image behavior:

- Body images are uploaded and rewritten to WeChat-hosted image URLs.
- The cover is uploaded as material and becomes the draft `thumb_media_id`.

## Non-original API draft workflow

```bash
node {baseDir}/scripts/publish_draft.mjs \
  --html "article.html" \
  --title "Article title" \
  --author "Author" \
  --summary "Article summary" \
  --cover "cover.png" \
  --dry-run
```

- `--html` is required and accepts HTML only.
- `--dry-run` validates the HTML input and publish payload without calling the WeChat API. Remove it only when the user asked to create a real draft.
- The script creates a normal draft only. It never previews, mass-sends, or declares originality.
- Accept optional `--account`, `--article-type news|newspic`, `--need-open-comment`, and `--only-fans-can-comment` when requested.

## Credentials and runtime

Credentials are resolved in this order:

1. `WECHAT_APP_ID` and `WECHAT_APP_SECRET` from the process environment.
2. Missing values from `{baseDir}/.baoyu-skills/.env`.

Copy `{baseDir}/.baoyu-skills/.env.example` to `.env` locally when environment variables are not used. Never commit the real `.env` file.

Install the minimal vendored publisher dependencies once:

```bash
cd {baseDir}/scripts/vendor/baoyu-post-to-wechat/scripts
npm install
```

The account must have API access and the publishing machine's public IP must be on the account API allowlist. A WeChat `40164` error means credential loading reached WeChat successfully but the source IP is not allowed.

## Existing references

- `references/api-draft-publish.md`: HTML-only API input, credentials, cover/body-image behavior, and troubleshooting.
- `references/troubleshooting.md`: existing browser-side diagnostics retained from the earlier workflow.
- `references/wechat-cdp.md`: existing browser/backend selectors and original-declaration context. It describes the legacy CDP helper, not Markdown conversion in this HTML-only API route.
- `references/theme-lab.md`: existing theme-draft reference retained for the Web editor; it is outside this skill's delivery scope.

## Third-party source

`scripts/vendor/baoyu-post-to-wechat/` contains the minimal WeChat API adapter files derived from `Aston1690/baoyu-post-to-wechat`. Source revision and license status are documented in its `THIRD_PARTY_NOTICES.md`.

## Report back to the user

- State that the input was already formatted HTML and name the script used.
- State whether validation, body image upload, cover upload, and draft creation succeeded.
- For a normal API publish, report the returned `media_id` without claiming originality.
- If something fails, identify the exact failed step and state whether the HTML artifact remains usable.
