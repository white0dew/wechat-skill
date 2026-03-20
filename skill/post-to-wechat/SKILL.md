---
name: post-to-wechat
description: Convert Markdown to WeChat-ready HTML and optionally automate the md2wechat web app plus WeChat Official Account backend via Chrome CDP. Use when the user asks to convert .md to WeChat HTML, copy rich text, select themes (including URL ?theme=), or auto-fill/save a WeChat draft.
---

# post-to-wechat

## Language

- Respond in the user's language.

## Resolve Base Directory

- Set `{baseDir}` to the directory containing this `SKILL.md`.

## Scripts

| Script | Purpose |
| --- | --- |
| `scripts/cdp_export.ts` | Drive the web app + WeChat backend via CDP, export HTML, and copy/paste rich text |

## Choose the path

- Use `scripts/cdp_export.ts` for HTML export through the web app, browser automation, rich-text copy, theme selection through the web app, or direct posting into WeChat Official Account backend.
- Prefer `scripts/cdp_export.ts` for end-to-end verification because it exercises the real web app behavior.

## Non-negotiables

- Use Chrome CDP for browser automation; do not use `agent-browser` for this skill.
- Default to the "复制富文本" button path; only use selection copy when explicitly requested or the button fails.
- When `--wechat` is enabled, treat "fill metadata + paste body + save draft" as the default workflow.

## Prereqs

- Node.js 24+ available (`node`); `scripts/cdp_export.ts` relies on native TypeScript execution.
- Default web app: `https://wechat.reshub.vip`.
- Do not start a local web server unless the user explicitly asks for local development or debugging.
- Chrome/Edge with remote debugging enabled for `--cdp`, or allow `--launch-local` to start a local Chrome.
- Logged-in WeChat Official Account session if using `--wechat`.

## Workflow

1. Determine whether the user wants HTML export only, rich-text copy, or full WeChat draft automation.
2. Run `scripts/cdp_export.ts` with the minimal flags required.
3. If the user mentions themes, pass `?theme=<name>` through `--app` or `--theme`.
4. If the user mentions WeChat posting, add `--wechat` and pass metadata overrides when available.
5. After execution, report what was actually completed: HTML generated, rich text copied, WeChat draft filled, cover uploaded, original marked, draft saved.

## Quick start

HTML export through the web app:

```bash
node {baseDir}/scripts/cdp_export.ts \
  --markdown-file "article.md" \
  --app "https://wechat.reshub.vip/?theme=minimal" \
  --cdp "http://127.0.0.1:9222" \
  --action export-html
```

CDP copy only:

```bash
node {baseDir}/scripts/cdp_export.ts \
  --markdown-file "article.md" \
  --app "https://wechat.reshub.vip" \
  --cdp "http://127.0.0.1:9222" \
  --action copy-rich
```

CDP + WeChat backend:

```bash
node {baseDir}/scripts/cdp_export.ts \
  --markdown-file "article.md" \
  --app "https://wechat.reshub.vip" \
  --cdp "http://127.0.0.1:9222" \
  --action copy-rich \
  --wechat
```

Theme preselection:

```bash
node {baseDir}/scripts/cdp_export.ts \
  --markdown-file "article.md" \
  --app "https://wechat.reshub.vip/?theme=minimal" \
  --cdp "http://127.0.0.1:9222" \
  --action copy-rich
```

Full draft example:

```bash
node {baseDir}/scripts/cdp_export.ts \
  --markdown-file "article.md" \
  --app "https://wechat.reshub.vip/?theme=default" \
  --cdp "http://127.0.0.1:9222" \
  --action copy-rich \
  --wechat \
  --title "测试标题" \
  --author "测试作者" \
  --summary "这是一段测试摘要。" \
  --cover "./cover.png"
```

## Inputs and metadata

- Accept Markdown via `--markdown-file`, stdin, or `--markdown` text.
- Parse frontmatter: `title`, `author`, `summary`, `coverImage`, `featureImage`, `cover`, `image`.
- Allow CLI overrides: `--title`, `--author`, `--summary`, `--cover`.
- Default `--wechat` saves draft unless `--no-submit`.
- Default to mark original unless `--no-original`.
- If both frontmatter and CLI args exist, CLI args win.

## Defaults that matter

- Default app URL: `https://wechat.reshub.vip`
- Default CDP URL: `http://127.0.0.1:9222`
- Default action: `copy-rich`
- Default copy strategy: click the "复制富文本" button
- Default WeChat behavior: save draft
- Default original behavior: enabled
- Default slow-down: `--delay-scale 3`
- Default jitter: `--jitter-ms 800`

## Theme selection

- Add `?theme=<name>` to the app URL to preselect a theme.
- Support built-in themes plus locally saved theme drafts.
- See `references/theme-lab.md` for import/export format and naming rules.

## Common flags

- `--markdown-file <path>`: read Markdown from file.
- `--markdown "<text>"`: pass Markdown directly.
- `--theme <name>`: select theme when supported by the script.
- `--app <url>`: override web app URL.
- `--cdp <url>`: connect to an existing Chrome CDP endpoint.
- `--launch-local`: launch a local Chrome if none is already running.
- `--wechat`: open WeChat Official Account backend and paste content.
- `--title`, `--author`, `--summary`, `--cover`: override parsed metadata.
- `--no-submit`: do everything except save draft.
- `--no-original`: skip original declaration flow.
- `--copy-strategy selection`: fallback copy mode.

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

## Report back to the user

- State which script was used.
- State whether the result was HTML only, copied rich text, or pasted into WeChat backend.
- If `--wechat` was used, state whether title, author, summary, cover, original declaration, and draft save each succeeded.
- If something failed, mention the exact step and whether the content itself was still produced.
