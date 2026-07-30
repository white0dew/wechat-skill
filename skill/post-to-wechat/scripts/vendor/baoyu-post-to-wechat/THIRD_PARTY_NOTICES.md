# Third-party notice: baoyu-post-to-wechat HTML API adapter

- Source: https://github.com/Aston1690/baoyu-post-to-wechat
- Vendored revision: `c5e55bff2f6304d5159b263e63b027385e10339d`
- License status: the source checkout used for this integration had no top-level license file. License permission remains pending verification; do not infer a license that was not provided.

Only the files required for HTML-to-draft publishing are included:

```text
scripts/wechat-api.ts
scripts/wechat-extend-config.ts
scripts/wechat-image-processor.ts
```

The upstream Markdown renderer, Markdown CLI, code-theme assets, and Chrome CDP vendor are deliberately excluded. This repository's wrapper accepts only a preformatted `.html` input and does not invoke upstream Markdown rendering paths.
