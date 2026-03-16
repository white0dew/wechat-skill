# Troubleshooting

## Preview does not update

- Ensure the editor input receives an `input` event after inserting Markdown.
- If the preview still looks stale, retry with `--copy-strategy selection`.
- As a last resort, manually focus the editor and insert a newline to trigger render.

## Copy/paste fails

- Confirm clipboard permissions on the OS.
- Use `--delay-scale` and `--jitter-ms` to slow UI steps.
- Verify the "复制富文本" button exists on the page.

## WeChat login timeout

- Increase `--wechat-wait` (milliseconds).
- Reuse a Chrome profile with an active WeChat session.

## Original declaration not applied

- Increase delays.
- Use the checkbox fallbacks in `references/wechat-cdp.md`.
- Treat a checked checkbox as success even if the label does not update.

## Cover upload missing

- Check that the cover triggers are present in the current WeChat UI.
- Update selectors in `scripts/cdp_export.mjs` if the UI changed.
