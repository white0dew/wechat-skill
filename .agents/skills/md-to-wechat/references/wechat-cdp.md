# WeChat CDP Flow (md2wechat)

## App-side flow

- Open the md2wechat web app (use `?theme=<name>` when needed).
- Inject Markdown and wait for the preview to update.
- Default copy strategy: click `[data-action="copy-rich"]`.
- Selection fallback (only when needed): select preview surface and copy.

Preview surface selectors (fallback):
- `#wechat-preview`
- `[data-role="preview-surface"]`

## WeChat backend flow

1. Open `https://mp.weixin.qq.com/` (CDP).
2. Click the menu item matching `--wechat-menu` (default `图文`).
3. Focus the editor (override with `--wechat-editor` if needed).
4. Paste from clipboard via CDP keyboard shortcut.

## Field selectors

- Title input: `#title`
- Author input: `#author`
- Summary input: `#summary`

## Cover upload triggers (ordered)

- `.js_cover`
- `#js_cover`
- `.js_select_cover`
- `.appmsg_cover`
- `.appmsg_cover__mask`
- `.appmsg_cover__add`
- `.cover__btn`
- `[data-role='cover']`

## Original declaration

1. Open modal:
   - `.js_unset_original_title` (preferred)
   - `.js_original_title` (fallback)
2. Check agreement (try in order):
   - `.original_agreement .weui-desktop-icon-checkbox`
   - `.original_agreement .weui-desktop-form__check-content`
   - `.original_agreement input.weui-desktop-form__checkbox`
3. Confirm:
   - `.weui-desktop-btn.weui-desktop-btn_primary`

Note: The status text sometimes fails to update even when the checkbox is checked.

## Save draft

- Click `#js_submit button`.
- Wait for `.weui-desktop-toast`.

## Override knobs

- `--wechat-menu` to change the entry label.
- `--wechat-editor` to target a specific editor selector.
- `--wechat-wait` to increase login wait time (ms).
