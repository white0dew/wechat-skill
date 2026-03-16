# Theme Lab

## Selection

- Use `?theme=<name>` in the web app URL to auto-select a theme.
- Theme names are normalized to lower-case, kebab-case for matching.
- Both built-in themes and saved drafts are eligible.

## Draft storage

- Local storage key: `md2wechat-theme-drafts`.
- Draft IDs are normalized and de-duplicated on save/import.

## Export

Theme Lab export produces JSON:

```json
{
  "version": 1,
  "exportedAt": "2025-01-01T00:00:00.000Z",
  "drafts": []
}
```

## Import

- Import accepts the same JSON shape (or just an array of drafts).
- Draft IDs are normalized; conflicts are de-duplicated.
- Built-in theme name conflicts are rejected during save.

## Route hints

- Theme lab route: `#/themes`
- Modal open: `?modal=themes`
