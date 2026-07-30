# API draft publishing

Use this path only for a non-original article that should be saved as a WeChat Official Account draft through the official API. It does not preview, declare originality, or mass-send content.

## Credentials

Set `WECHAT_APP_ID` and `WECHAT_APP_SECRET` in the process environment. As a fallback, copy `.baoyu-skills/.env.example` to `.baoyu-skills/.env` beside this skill and fill the values. Existing process environment values always win.

The account must have API access, and the caller's public IP must be present in the account's API allowlist. Keep `.baoyu-skills/.env` private.

## First-time runtime setup

The API adapter vendors source code but intentionally does not commit `node_modules`. Install its locked runtime dependencies once from the vendored scripts directory:

```bash
cd {baseDir}/scripts/vendor/baoyu-post-to-wechat/scripts
npx -y bun install --frozen-lockfile
```

This installs only local runtime dependencies for the draft adapter. It does not start a service and does not create a draft.

## Command

```bash
node {baseDir}/scripts/publish_draft.mjs \
  --html "article-fragment.html" \
  --title "Article title" \
  --cover "cover.png" \
  --dry-run
```

Remove `--dry-run` only when the user has asked to create the draft. The script wraps the HTML fragment in a minimal document, invokes the vendored baoyu API implementation, and reports its output unchanged.

Options:

- `--html <file>` is mandatory.
- `--title`, `--author`, `--summary`, and `--cover` set draft metadata.
- `--account <alias>` selects account-specific credentials/configuration.
- `--article-type <news|newspic>` defaults to `news`.
- `--need-open-comment [0|1]` and `--only-fans-can-comment [0|1]` configure comments; a bare flag means `1`.
- `--dry-run` parses the document without calling the WeChat API.

For original declaration or any workflow requiring the WeChat backend UI, use the CDP path instead.
