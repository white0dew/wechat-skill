import {
  type ClipboardEvent,
  type DragEvent,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { listThemes, renderMarkdownToWechat, type Theme } from "@md2wechat/core";
import { examples } from "./examples";
import {
  createDefaultImageUploadSettings,
  loadImageUploadSettings,
  saveImageUploadSettings,
  uploadImageFile,
  type ImageUploadSettings
} from "./imageUpload";
import {
  createEmptyDraft,
  createDraftFromTheme,
  draftToTheme,
  exportThemeCode,
  loadThemeDrafts,
  normalizeThemeId,
  saveThemeDrafts,
  type ThemeDraft
} from "./themeDrafts";

type Route = "editor" | "theme-lab";

type EditorSettings = {
  syncScroll: boolean;
  previewFontFamily: string;
  previewFontSize: number;
};

type AppTheme = ReturnType<typeof listThemes>[number];
type FontOption = { label: string; value: string };
type FontSizeOption = { label: string; value: number };
type UploadStatus = {
  kind: "idle" | "uploading" | "success" | "error";
  message: string;
};

const pickerPreviewMarkdown = `## 二级标题
### 三级标题
> 一级引用示例

一读一本好书，就是在和高尚的人谈话。
`;

const labPreviewMarkdown = examples[2]?.markdown ?? examples[0].markdown;
const fontOptions: FontOption[] = [
  { label: "跟随主题", value: "theme" },
  {
    label: "系统黑体",
    value:
      "-apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif"
  },
  {
    label: "系统宋体",
    value: "Songti SC, STSong, SimSun, Georgia, serif"
  }
];
const fontSizeOptions: FontSizeOption[] = [
  { label: "14", value: 14 },
  { label: "15", value: 15 },
  { label: "16", value: 16 },
  { label: "18", value: 18 }
];

function getRouteFromHash(): Route {
  return window.location.hash === "#/themes" ? "theme-lab" : "editor";
}

function sanitizeRoute(route: Route) {
  return route === "theme-lab" ? "#/themes" : "#/";
}

function getThemeModalFromSearch() {
  return typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("modal") === "themes"
    : false;
}

function getThemeFromSearch() {
  if (typeof window === "undefined") {
    return null;
  }
  const value = new URLSearchParams(window.location.search).get("theme");
  return value && value.trim() ? value.trim() : null;
}

function getThemeSwatches(theme: AppTheme) {
  return [
    typeof theme.styles.link.color === "string" ? theme.styles.link.color : "#2563eb",
    typeof theme.styles.blockquote.container.borderLeft === "string"
      ? theme.styles.blockquote.container.borderLeft.split(" ").at(-1) ?? "#475569"
      : "#475569",
    typeof theme.styles.container.backgroundColor === "string"
      ? theme.styles.container.backgroundColor
      : "#ffffff"
  ];
}

function parsePixelValue(value: string | number | undefined, fallback: number) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function scaleFontSizeValue(
  value: string | number | undefined,
  ratio: number
): string | number | undefined {
  if (typeof value === "number") {
    return `${Math.round(value * ratio * 100) / 100}px`;
  }

  if (typeof value === "string" && value.endsWith("px")) {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return `${Math.round(parsed * ratio * 100) / 100}px`;
    }
  }

  return value;
}

function createPreviewTheme(theme: Theme, settings: EditorSettings): Theme {
  const baseFontSize = parsePixelValue(theme.styles.container.fontSize, 16);
  const scaleRatio = settings.previewFontSize / baseFontSize;
  const fontFamily =
    settings.previewFontFamily === "theme"
      ? theme.styles.container.fontFamily
      : settings.previewFontFamily;

  return {
    ...theme,
    styles: {
      ...theme.styles,
      container: {
        ...theme.styles.container,
        fontFamily,
        fontSize: `${settings.previewFontSize}px`
      },
      headings: {
        1: {
          ...theme.styles.headings[1],
          fontSize: scaleFontSizeValue(theme.styles.headings[1].fontSize, scaleRatio)
        },
        2: {
          ...theme.styles.headings[2],
          fontSize: scaleFontSizeValue(theme.styles.headings[2].fontSize, scaleRatio)
        },
        3: {
          ...theme.styles.headings[3],
          fontSize: scaleFontSizeValue(theme.styles.headings[3].fontSize, scaleRatio)
        },
        4: {
          ...theme.styles.headings[4],
          fontSize: scaleFontSizeValue(theme.styles.headings[4].fontSize, scaleRatio)
        },
        5: {
          ...theme.styles.headings[5],
          fontSize: scaleFontSizeValue(theme.styles.headings[5].fontSize, scaleRatio)
        },
        6: {
          ...theme.styles.headings[6],
          fontSize: scaleFontSizeValue(theme.styles.headings[6].fontSize, scaleRatio)
        }
      },
      codeBlock: {
        ...theme.styles.codeBlock,
        code: {
          ...theme.styles.codeBlock.code,
          fontSize: scaleFontSizeValue(theme.styles.codeBlock.code.fontSize, scaleRatio)
        }
      },
      image: {
        ...theme.styles.image,
        caption: {
          ...theme.styles.image.caption,
          fontSize: scaleFontSizeValue(theme.styles.image.caption.fontSize, scaleRatio)
        }
      }
    }
  };
}

function SectionTitle({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {children ? <div className="section-title-side">{children}</div> : null}
    </div>
  );
}

function extractImageFiles(items: Iterable<DataTransferItem>) {
  return [...items]
    .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
    .map((item) => item.getAsFile())
    .filter((file): file is File => Boolean(file));
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.4 2.8h3.2l.5 2.05c.37.12.73.27 1.07.45l1.87-1.03 2.27 2.27-1.03 1.87c.18.34.33.7.45 1.07L21.2 10.4v3.2l-2.05.5c-.12.37-.27.73-.45 1.07l1.03 1.87-2.27 2.27-1.87-1.03c-.34.18-.7.33-1.07.45l-.5 2.05h-3.2l-.5-2.05a7.1 7.1 0 0 1-1.07-.45l-1.87 1.03-2.27-2.27 1.03-1.87a7.1 7.1 0 0 1-.45-1.07l-2.05-.5v-3.2l2.05-.5c.12-.37.27-.73.45-1.07L4.27 6.54l2.27-2.27 1.87 1.03c.34-.18.7-.33 1.07-.45zM12 9.1A2.9 2.9 0 1 0 12 14.9 2.9 2.9 0 0 0 12 9.1"
        fill="currentColor"
      />
    </svg>
  );
}

function ThemePickerModal({
  open,
  themes,
  selectedTheme,
  modalPreviewMap,
  onClose,
  onSelect,
  onCreate
}: {
  open: boolean;
  themes: AppTheme[];
  selectedTheme: AppTheme;
  modalPreviewMap: Map<string, string>;
  onClose: () => void;
  onSelect: (theme: AppTheme) => void;
  onCreate: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="theme-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Theme Picker"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="theme-modal-header">
          <div className="theme-modal-tabs">
            <button type="button" className="is-active">
              推荐
            </button>
          </div>
          <button type="button" className="menu-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="theme-picker-grid">
          <button
            type="button"
            className="theme-picker-card theme-picker-new"
            onClick={onCreate}
          >
            <div className="theme-picker-new-icon">+</div>
            <div className="theme-picker-new-title">新建主题</div>
            <p>进入主题实验室，可从零开始或基于推荐主题调整。</p>
          </button>
          {themes.map((theme) => {
            const active = theme.name === selectedTheme.name;
            return (
              <article
                key={theme.name}
                className={active ? "theme-picker-card is-active" : "theme-picker-card"}
              >
                <div className="theme-picker-preview-shell">
                  <div
                    className="theme-picker-preview"
                    dangerouslySetInnerHTML={{ __html: modalPreviewMap.get(theme.name) ?? "" }}
                  />
                </div>
                <div className="theme-picker-meta">
                  <div>
                    <strong>{theme.label}</strong>
                    <p>{theme.summary}</p>
                  </div>
                  <button
                    type="button"
                    className={active ? "mini-button is-active" : "mini-button"}
                    onClick={() => onSelect(theme)}
                  >
                    {active ? "已使用" : "使用"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ThemeLabPage({
  builtinThemes,
  draft,
  setDraft,
  themeDrafts,
  onClose,
  onSaveDraft,
  onRemoveDraft,
  onOpenDraft,
  onUseDraft,
  onExportDrafts,
  onImportDrafts,
  copiedTs,
  onCopyThemeTs,
  onExportThemeTs
}: {
  builtinThemes: AppTheme[];
  draft: ThemeDraft;
  setDraft: React.Dispatch<React.SetStateAction<ThemeDraft>>;
  themeDrafts: ThemeDraft[];
  onClose: () => void;
  onSaveDraft: () => void;
  onRemoveDraft: (id: string) => void;
  onOpenDraft: (draft: ThemeDraft) => void;
  onUseDraft: (draft: ThemeDraft) => void;
  onExportDrafts: () => void;
  onImportDrafts: (files: FileList | null) => void;
  copiedTs: boolean;
  onCopyThemeTs: () => Promise<void>;
  onExportThemeTs: () => void;
}) {
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const draftPreviewTheme = useMemo(() => draftToTheme(draft), [draft]);
  const preview = renderMarkdownToWechat(labPreviewMarkdown, {
    theme: draftPreviewTheme
  });

  return (
    <section className="page-shell theme-lab-page">
      <div className="theme-lab-header">
        <div className="theme-lab-header-copy">
          <p className="eyebrow">Theme Lab</p>
          <h1>主题实验室</h1>
          <p>调整主题参数、预览效果，并在完成后返回编辑器继续排版。</p>
        </div>
        <button type="button" className="action-button" onClick={onClose}>
          返回编辑器
        </button>
      </div>

      <div className="theme-lab-layout compact-top">
        <aside className="studio-card lab-form-card">
          <SectionTitle eyebrow="Theme Form" title="主题参数" />

          <div className="lab-form-grid">
            <label className="field">
              <span>Theme ID</span>
              <input
                value={draft.id}
                onChange={(event) => setDraft((current) => ({ ...current, id: event.target.value }))}
              />
            </label>
            <label className="field">
              <span>显示名称</span>
              <input
                value={draft.label}
                onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
              />
            </label>
            <label className="field field-span-2">
              <span>主题描述</span>
              <textarea
                className="compact-textarea"
                value={draft.summary}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, summary: event.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>基础主题</span>
              <select
                value={draft.baseThemeName}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    baseThemeName: event.target.value as ThemeDraft["baseThemeName"]
                  }))
                }
              >
                {builtinThemes.map((theme) => (
                  <option key={theme.name} value={theme.name}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>字体族</span>
              <input
                value={draft.fontFamily}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, fontFamily: event.target.value }))
                }
              />
            </label>
            {[
              ["正文颜色", "bodyColor"],
              ["标题颜色", "headingColor"],
              ["强调色", "accentColor"],
              ["背景色", "backgroundColor"],
              ["引用背景", "quoteBackground"],
              ["代码块背景", "codeBackground"],
              ["图片边框", "imageBorder"]
            ].map(([label, key]) => (
              <label key={key} className="color-field">
                <span>{label}</span>
                <input
                  type="color"
                  value={draft[key as keyof ThemeDraft] as string}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: event.target.value
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <div className="lab-actions">
            <button type="button" className="action-button primary" onClick={onSaveDraft}>
              保存到本地
            </button>
            <button type="button" className="action-button" onClick={onExportDrafts}>
              导出主题 JSON
            </button>
            <button
              type="button"
              className="action-button"
              onClick={() => importInputRef.current?.click()}
            >
              导入主题
            </button>
            <button type="button" className="action-button" onClick={onCopyThemeTs}>
              {copiedTs ? "已复制 TS" : "复制 TS"}
            </button>
            <button type="button" className="action-button" onClick={onExportThemeTs}>
              导出 TS
            </button>
            <button type="button" className="action-button" onClick={() => setDraft(createEmptyDraft())}>
              新建草稿
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={(event) => {
                onImportDrafts(event.currentTarget.files);
                event.currentTarget.value = "";
              }}
            />
          </div>

          <div className="saved-theme-block">
            <SectionTitle eyebrow="Saved Drafts" title={`已保存主题 (${themeDrafts.length})`} />
            <div className="saved-theme-list">
              {themeDrafts.map((item) => (
                <article key={item.id} className="saved-theme-item">
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.summary}</p>
                  </div>
                  <div className="saved-theme-actions">
                    <button type="button" className="mini-button" onClick={() => onOpenDraft(item)}>
                      编辑
                    </button>
                    <button type="button" className="mini-button" onClick={() => onUseDraft(item)}>
                      使用
                    </button>
                    <button
                      type="button"
                      className="mini-button danger"
                      onClick={() => onRemoveDraft(item.id)}
                    >
                      删除
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>

        <main className="studio-card lab-preview-card">
          <SectionTitle eyebrow="Preview" title={draftPreviewTheme.label} />

          <div className="lab-preview-stage">
            <div className="preview-surface polished">
              <div
                className="wechat-preview"
                dangerouslySetInnerHTML={{ __html: preview.html }}
              />
            </div>
          </div>

        </main>
      </div>
    </section>
  );
}

export default function App() {
  const builtinThemes = useMemo(() => listThemes(), []);
  const [route, setRoute] = useState<Route>(() =>
    typeof window === "undefined" ? "editor" : getRouteFromHash()
  );
  const [themeDrafts, setThemeDrafts] = useState<ThemeDraft[]>(() =>
    typeof window === "undefined" ? [] : loadThemeDrafts()
  );
  const [themeName, setThemeName] = useState(builtinThemes[0]?.name ?? "default");
  const [markdown, setMarkdown] = useState(examples[0].markdown);
  const [copied, setCopied] = useState(false);
  const [copiedTs, setCopiedTs] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(() => getThemeModalFromSearch());
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [imageUploadSettings, setImageUploadSettings] = useState<ImageUploadSettings>(() =>
    typeof window === "undefined"
      ? createDefaultImageUploadSettings()
      : loadImageUploadSettings()
  );
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    kind: "idle",
    message: ""
  });
  const [editorDragActive, setEditorDragActive] = useState(false);
  const [settings, setSettings] = useState<EditorSettings>({
    syncScroll: true,
    previewFontFamily: "theme",
    previewFontSize: 16
  });
  const [draft, setDraft] = useState<ThemeDraft>(createEmptyDraft);
  const draftOriginIdRef = useRef<string | null>(null);
  const themeFromSearchRef = useRef<string | null>(
    typeof window === "undefined" ? null : getThemeFromSearch()
  );
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const syncingRef = useRef<"editor" | "preview" | null>(null);
  const uploadStatusTimerRef = useRef<number | null>(null);
  const deferredMarkdown = useDeferredValue(markdown);
  const localThemes = useMemo(() => themeDrafts.map((item) => draftToTheme(item)), [themeDrafts]);
  const availableThemes = useMemo(
    () => [...builtinThemes, ...localThemes],
    [builtinThemes, localThemes]
  );
  const selectedTheme =
    availableThemes.find((theme) => theme.name === themeName) ?? builtinThemes[0];
  const previewTheme = useMemo(
    () => createPreviewTheme(selectedTheme, settings),
    [selectedTheme, settings]
  );
  const result = renderMarkdownToWechat(deferredMarkdown, {
    theme: previewTheme
  });
  const modalPreviewMap = useMemo(
    () =>
      new Map(
        availableThemes.map((theme) => [
          theme.name,
          renderMarkdownToWechat(pickerPreviewMarkdown, { theme }).html
        ])
      ),
    [availableThemes]
  );
  const generatedTs = useMemo(() => exportThemeCode(draft), [draft]);
  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const nextUrl = new URL(window.location.href);
    if (themeModalOpen) {
      nextUrl.searchParams.set("modal", "themes");
      setSettingsPanelOpen(false);
    } else {
      nextUrl.searchParams.delete("modal");
    }
    window.history.replaceState({}, "", nextUrl);
  }, [themeModalOpen]);

  useEffect(() => {
    saveThemeDrafts(themeDrafts);
  }, [themeDrafts]);

  useEffect(() => {
    saveImageUploadSettings(imageUploadSettings);
  }, [imageUploadSettings]);

  useEffect(() => {
    if (!availableThemes.some((theme) => theme.name === themeName)) {
      setThemeName(builtinThemes[0]?.name ?? "default");
    }
  }, [availableThemes, builtinThemes, themeName]);

  useEffect(() => {
    const requested = themeFromSearchRef.current;
    if (!requested) {
      return;
    }
    const normalized = normalizeThemeId(requested);
    const target = availableThemes.find(
      (theme) => theme.name === requested || theme.name === normalized
    );
    if (target) {
      setThemeName(target.name);
      themeFromSearchRef.current = null;
    }
  }, [availableThemes]);

  useEffect(
    () => () => {
      if (uploadStatusTimerRef.current) {
        window.clearTimeout(uploadStatusTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSettingsPanelOpen(false);
        setThemeModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const editor = textareaRef.current;
    const preview = previewRef.current;

    if (!editor || !preview || !settings.syncScroll) {
      return;
    }

    const syncScroll = (
      source: HTMLElement,
      target: HTMLElement,
      sourceType: "editor" | "preview"
    ) => {
      if (syncingRef.current && syncingRef.current !== sourceType) {
        return;
      }

      const sourceMax = source.scrollHeight - source.clientHeight;
      const targetMax = target.scrollHeight - target.clientHeight;
      const ratio = sourceMax > 0 ? source.scrollTop / sourceMax : 0;
      syncingRef.current = sourceType;
      target.scrollTop = ratio * targetMax;
      window.requestAnimationFrame(() => {
        syncingRef.current = null;
      });
    };

    const onEditorScroll = () => syncScroll(editor, preview, "editor");
    const onPreviewScroll = () => syncScroll(preview, editor, "preview");
    editor.addEventListener("scroll", onEditorScroll);
    preview.addEventListener("scroll", onPreviewScroll);

    return () => {
      editor.removeEventListener("scroll", onEditorScroll);
      preview.removeEventListener("scroll", onPreviewScroll);
    };
  }, [settings.syncScroll, deferredMarkdown, previewTheme]);

  function flashUploadStatus(nextStatus: UploadStatus, timeoutMs = 2600) {
    if (uploadStatusTimerRef.current) {
      window.clearTimeout(uploadStatusTimerRef.current);
      uploadStatusTimerRef.current = null;
    }

    setUploadStatus(nextStatus);

    if (nextStatus.kind === "uploading" || nextStatus.kind === "idle") {
      return;
    }

    uploadStatusTimerRef.current = window.setTimeout(() => {
      setUploadStatus({ kind: "idle", message: "" });
      uploadStatusTimerRef.current = null;
    }, timeoutMs);
  }

  function insertMarkdownAtCursor(insertText: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      setMarkdown((current) => `${current}${current.endsWith("\n") ? "" : "\n"}${insertText}`);
      return;
    }

    const start = textarea.selectionStart ?? markdown.length;
    const end = textarea.selectionEnd ?? markdown.length;
    setMarkdown((current) => `${current.slice(0, start)}${insertText}${current.slice(end)}`);

    window.requestAnimationFrame(() => {
      const nextCursor = start + insertText.length;
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  async function uploadImages(files: File[], source: "paste" | "drop") {
    if (files.length === 0) {
      return;
    }

    flashUploadStatus({
      kind: "uploading",
      message: `正在上传 ${files.length} 张图片...`
    });

    try {
      const uploaded = [];

      for (const file of files) {
        uploaded.push(await uploadImageFile(file, imageUploadSettings));
      }

      const markdownBlock = uploaded.map((item) => `![](${item.url})`).join("\n\n");
      const currentValue = textareaRef.current?.value ?? markdown;
      const prefix = currentValue.trim().length === 0 ? "" : "\n\n";
      const suffix = "\n";
      insertMarkdownAtCursor(`${prefix}${markdownBlock}${suffix}`);
      flashUploadStatus({
        kind: "success",
        message: `已上传 ${uploaded.length} 张图片并插入 Markdown`
      });
    } catch (error) {
      flashUploadStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "图片上传失败"
      }, 4200);
    } finally {
      setEditorDragActive(false);
    }
  }

  function handleEditorPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const files = extractImageFiles(event.clipboardData.items);
    if (files.length === 0) {
      return;
    }

    event.preventDefault();
    void uploadImages(files, "paste");
  }

  function handleEditorDragOver(event: DragEvent<HTMLTextAreaElement>) {
    const hasImageFile = [...event.dataTransfer.items].some(
      (item) => item.kind === "file" && item.type.startsWith("image/")
    );
    if (!hasImageFile) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setEditorDragActive(true);
  }

  function handleEditorDragEnter(event: DragEvent<HTMLTextAreaElement>) {
    const hasImageFile = [...event.dataTransfer.items].some(
      (item) => item.kind === "file" && item.type.startsWith("image/")
    );
    if (hasImageFile) {
      setEditorDragActive(true);
    }
  }

  function handleEditorDrop(event: DragEvent<HTMLTextAreaElement>) {
    const files = [...event.dataTransfer.files].filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) {
      setEditorDragActive(false);
      return;
    }

    event.preventDefault();
    void uploadImages(files, "drop");
  }

  function handleEditorDragLeave(event: DragEvent<HTMLTextAreaElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setEditorDragActive(false);
  }

  function navigate(nextRoute: Route) {
    window.location.hash = sanitizeRoute(nextRoute);
    setRoute(nextRoute);
    setSettingsPanelOpen(false);
  }

  async function copyRichContent() {
    const plainText = previewRef.current?.innerText ?? result.meta.title ?? "md2wechat";

    if (
      typeof window !== "undefined" &&
      "ClipboardItem" in window &&
      navigator.clipboard &&
      typeof navigator.clipboard.write === "function"
    ) {
      const item = new ClipboardItem({
        "text/html": new Blob([result.html], { type: "text/html" }),
        "text/plain": new Blob([plainText], { type: "text/plain" })
      });

      try {
        await navigator.clipboard.write([item]);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        return;
      } catch {
        // Fall back to selection-based copy below.
      }
    }

    const tempContainer = document.createElement("div");
    tempContainer.contentEditable = "true";
    tempContainer.setAttribute("aria-hidden", "true");
    tempContainer.style.position = "fixed";
    tempContainer.style.pointerEvents = "none";
    tempContainer.style.opacity = "0";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    tempContainer.innerHTML = result.html;
    document.body.appendChild(tempContainer);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(tempContainer);
    selection?.removeAllRanges();
    selection?.addRange(range);
    document.execCommand("copy");
    selection?.removeAllRanges();
    document.body.removeChild(tempContainer);

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function copyThemeTs() {
    await navigator.clipboard.writeText(generatedTs);
    setCopiedTs(true);
    window.setTimeout(() => setCopiedTs(false), 1600);
  }

  function exportHtml() {
    const blob = new Blob([result.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wechat-${selectedTheme.name}.html`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportThemeTsFile() {
    const blob = new Blob([generatedTs], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${draft.id || "custom-theme"}.ts`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportThemeDrafts() {
    if (themeDrafts.length === 0) {
      window.alert("当前没有已保存主题可以导出。");
      return;
    }

    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      drafts: themeDrafts
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `md2wechat-themes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function coerceDraft(input: Partial<ThemeDraft>): ThemeDraft | null {
    if (!input || typeof input !== "object") {
      return null;
    }

    const fallback = createEmptyDraft();
    const baseThemeName = builtinThemes.some((theme) => theme.name === input.baseThemeName)
      ? (input.baseThemeName as ThemeDraft["baseThemeName"])
      : fallback.baseThemeName;

    return {
      ...fallback,
      id:
        typeof input.id === "string" && input.id.trim()
          ? input.id.trim()
          : fallback.id,
      label:
        typeof input.label === "string" && input.label.trim()
          ? input.label.trim()
          : fallback.label,
      summary: typeof input.summary === "string" ? input.summary : fallback.summary,
      baseThemeName,
      fontFamily: typeof input.fontFamily === "string" ? input.fontFamily : fallback.fontFamily,
      bodyColor: typeof input.bodyColor === "string" ? input.bodyColor : fallback.bodyColor,
      headingColor: typeof input.headingColor === "string" ? input.headingColor : fallback.headingColor,
      accentColor: typeof input.accentColor === "string" ? input.accentColor : fallback.accentColor,
      backgroundColor:
        typeof input.backgroundColor === "string" ? input.backgroundColor : fallback.backgroundColor,
      quoteBackground:
        typeof input.quoteBackground === "string" ? input.quoteBackground : fallback.quoteBackground,
      codeBackground:
        typeof input.codeBackground === "string" ? input.codeBackground : fallback.codeBackground,
      imageBorder: typeof input.imageBorder === "string" ? input.imageBorder : fallback.imageBorder
    };
  }

  async function importThemeDrafts(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch (error) {
      window.alert(
        `主题导入失败：${error instanceof Error ? error.message : "JSON 解析失败"}`
      );
      return;
    }

    const rawDrafts = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { drafts?: unknown }).drafts)
        ? (parsed as { drafts: unknown[] }).drafts
        : null;

    if (!rawDrafts) {
      window.alert("主题导入失败：JSON 格式不正确（需要数组或包含 drafts 数组）。");
      return;
    }

    const builtinNames = new Set(builtinThemes.map((theme) => theme.name));
    const imported = rawDrafts
      .map((item) => coerceDraft(item as Partial<ThemeDraft>))
      .filter((item): item is ThemeDraft => Boolean(item))
      .map((item) => ({ ...item, id: normalizeThemeId(item.id) }))
      .filter((item) => !builtinNames.has(item.id));

    if (imported.length === 0) {
      window.alert("主题导入失败：没有可用的主题（可能与内置主题冲突）。");
      return;
    }

    setThemeDrafts((current) => {
      const map = new Map<string, ThemeDraft>();
      for (const item of imported) {
        map.set(item.id, item);
      }
      for (const item of current) {
        const normalizedId = normalizeThemeId(item.id);
        if (!map.has(normalizedId)) {
          map.set(normalizedId, { ...item, id: normalizedId });
        }
      }
      return Array.from(map.values());
    });

    const ignored = rawDrafts.length - imported.length;
    window.alert(
      `已导入 ${imported.length} 个主题${ignored > 0 ? `，忽略 ${ignored} 个无效或冲突主题` : ""}。`
    );
  }

  function upsertDraft() {
    const normalizedId = normalizeThemeId(draft.id);
    const hasBuiltinConflict = builtinThemes.some((theme) => theme.name === normalizedId);
    if (hasBuiltinConflict) {
      window.alert("主题 ID 与内置主题重复，请更换 ID。");
      return;
    }

    const existingIndex = themeDrafts.findIndex(
      (item) => normalizeThemeId(item.id) === normalizedId
    );
    const originId = draftOriginIdRef.current;
    const isEditingExisting = originId && originId === normalizedId;
    if (existingIndex !== -1 && !isEditingExisting) {
      window.alert("主题 ID 与已保存主题重复，请更换 ID 或从已保存主题进入编辑。");
      return;
    }

    const nextDraft = {
      ...draft,
      id: normalizedId || "custom-sandbox",
      label: draft.label.trim() || "Custom Sandbox",
      summary: draft.summary.trim() || "本地实验主题，用来验证新主题方案。"
    };

    setDraft(nextDraft);
    setThemeDrafts((current) => {
      if (existingIndex === -1) {
        return [nextDraft, ...current];
      }
      return current.map((item, itemIndex) => (itemIndex === existingIndex ? nextDraft : item));
    });
    draftOriginIdRef.current = nextDraft.id;
  }

  function removeDraft(id: string) {
    setThemeDrafts((current) => current.filter((item) => item.id !== id));
  }

  function openDraft(item: ThemeDraft) {
    setDraft(item);
    draftOriginIdRef.current = normalizeThemeId(item.id);
    navigate("theme-lab");
  }

  function createDraftFromSelectedTheme() {
    setDraft(createDraftFromTheme(selectedTheme));
    draftOriginIdRef.current = null;
    setThemeModalOpen(false);
    navigate("theme-lab");
  }

  function useDraftInEditor(item: ThemeDraft) {
    setThemeName(draftToTheme(item).name);
    navigate("editor");
  }

  const themeSwatches = getThemeSwatches(selectedTheme);

  return (
    <div className="app-frame">
      <div className="app-layout">
        <div className="workspace-shell">
          <header className="workspace-toolbar" role="toolbar" aria-label="App toolbar">
            <div className="brand-lockup rail-brand">
              <span className="brand-mark">M</span>
              <div className="brand-copy">
                <strong>Md2Wechat</strong>
                <p>让微信公众号发布更加简单</p>
              </div>
            </div>
            <div className="toolbar-actions">
              <button
                type="button"
                className={
                  settingsPanelOpen
                    ? "toolbar-action-button is-active"
                    : "toolbar-action-button"
                }
                onClick={() => setSettingsPanelOpen((current) => !current)}
              >
                <span className="toolbar-action-icon">
                  <SettingsIcon />
                </span>
                <span>设置</span>
              </button>
            </div>
          </header>

          {route === "editor" ? (
            <section className="page-shell editor-page">
              <div className="editor-content-layout compact-top">
                <aside
                  className={
                    editorDragActive
                      ? "studio-card editor-composer is-drag-active"
                      : "studio-card editor-composer"
                  }
                >
                  <SectionTitle title="编辑区">
                    {uploadStatus.kind !== "idle" ? (
                      <span className={`status-chip is-${uploadStatus.kind}`}>
                        {uploadStatus.message}
                      </span>
                    ) : (
                      <span className="editor-hint">粘贴或拖拽图片自动上传</span>
                    )}
                  </SectionTitle>

                  <textarea
                    ref={textareaRef}
                    id="markdown-editor"
                    data-role="markdown-input"
                    className="markdown-input"
                    value={markdown}
                    onChange={(event) => setMarkdown(event.target.value)}
                    onPaste={handleEditorPaste}
                    onDragOver={handleEditorDragOver}
                    onDragEnter={handleEditorDragEnter}
                    onDragLeave={handleEditorDragLeave}
                    onDrop={handleEditorDrop}
                    spellCheck={false}
                    style={{
                      fontFamily:
                        settings.previewFontFamily === "theme"
                          ? undefined
                          : settings.previewFontFamily
                    }}
                  />
                </aside>

                <main className="studio-card editor-preview-panel">
                  <SectionTitle title="预览区">
                    <div className="preview-tools">
                      <button
                        type="button"
                        className="action-button"
                        data-action="copy-rich"
                        onClick={copyRichContent}
                      >
                        {copied ? "已导出微信" : "导出微信"}
                      </button>
                      <button
                        type="button"
                        className="action-button"
                        data-action="export-html"
                        onClick={exportHtml}
                      >
                        导出 HTML
                      </button>
                    </div>
                  </SectionTitle>

                  <div className="preview-surface polished">
                    <div
                      ref={previewRef}
                      id="wechat-preview"
                      data-role="preview-surface"
                      className="wechat-preview"
                      dangerouslySetInnerHTML={{ __html: result.html }}
                    />
                  </div>
                </main>
              </div>
            </section>
          ) : (
            <ThemeLabPage
              builtinThemes={builtinThemes}
              draft={draft}
              setDraft={setDraft}
              themeDrafts={themeDrafts}
              onClose={() => navigate("editor")}
              onSaveDraft={upsertDraft}
              onRemoveDraft={removeDraft}
              onOpenDraft={openDraft}
              onUseDraft={useDraftInEditor}
              onExportDrafts={exportThemeDrafts}
              onImportDrafts={importThemeDrafts}
              copiedTs={copiedTs}
              onCopyThemeTs={copyThemeTs}
              onExportThemeTs={exportThemeTsFile}
            />
          )}
        </div>

        <div className={settingsPanelOpen ? "settings-drawer-shell is-open" : "settings-drawer-shell"}>
          <aside className="settings-drawer" role="dialog" aria-label="Settings">
            <div className="settings-drawer-header">
              <strong>设置</strong>
              <button
                type="button"
                className="menu-close-button"
                onClick={() => setSettingsPanelOpen(false)}
              >
                ×
              </button>
            </div>

            <section className="drawer-section">
              <SectionTitle title="主题" />
              <button
                type="button"
                className="theme-current-card"
                onClick={() => {
                  setSettingsPanelOpen(false);
                  setThemeModalOpen(true);
                }}
              >
                <span className="theme-swatch-row" aria-hidden="true">
                  {themeSwatches.map((color) => (
                    <span
                      key={color}
                      className="theme-swatch-dot"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span className="theme-current-meta">
                  <strong>{selectedTheme.label}</strong>
                  <span>更换</span>
                </span>
              </button>
            </section>

            <section className="drawer-section">
              <SectionTitle title="字体" />
              <div className="option-grid">
                {fontOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      settings.previewFontFamily === option.value
                        ? "option-chip is-active"
                        : "option-chip"
                    }
                    onClick={() =>
                      setSettings((current) => ({
                        ...current,
                        previewFontFamily: option.value
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="drawer-section">
              <SectionTitle title="字号" />
              <div className="option-grid size-grid">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      settings.previewFontSize === option.value
                        ? "option-chip is-active"
                        : "option-chip"
                    }
                    onClick={() =>
                      setSettings((current) => ({
                        ...current,
                        previewFontSize: option.value
                      }))
                    }
                  >
                    {option.label}px
                  </button>
                ))}
              </div>
            </section>

            {false && (
              <section className="drawer-section">
                <SectionTitle title="图片上传" />
                <div className="drawer-form-grid">
                  <label className="drawer-field field-span-2">
                    <span>GitHub Token</span>
                    <input
                      className="drawer-text-input"
                      type="password"
                      value={imageUploadSettings.githubToken}
                      onChange={(event) =>
                        setImageUploadSettings((current) => ({
                          ...current,
                          githubToken: event.target.value
                        }))
                      }
                      placeholder="ghp_xxx 或 fine-grained token"
                      autoComplete="off"
                    />
                  </label>
                  <label className="drawer-field">
                    <span>Owner</span>
                    <input
                      className="drawer-text-input"
                      value={imageUploadSettings.githubOwner}
                      onChange={(event) =>
                        setImageUploadSettings((current) => ({
                          ...current,
                          githubOwner: event.target.value
                        }))
                      }
                      placeholder="yourname"
                      autoComplete="off"
                    />
                  </label>
                  <label className="drawer-field">
                    <span>Repo</span>
                    <input
                      className="drawer-text-input"
                      value={imageUploadSettings.githubRepo}
                      onChange={(event) =>
                        setImageUploadSettings((current) => ({
                          ...current,
                          githubRepo: event.target.value
                        }))
                      }
                      placeholder="md2wechat-assets"
                      autoComplete="off"
                    />
                  </label>
                  <label className="drawer-field">
                    <span>Branch</span>
                    <input
                      className="drawer-text-input"
                      value={imageUploadSettings.githubBranch}
                      onChange={(event) =>
                        setImageUploadSettings((current) => ({
                          ...current,
                          githubBranch: event.target.value
                        }))
                      }
                      placeholder="main"
                      autoComplete="off"
                    />
                  </label>
                  <label className="drawer-field">
                    <span>目录</span>
                    <input
                      className="drawer-text-input"
                      value={imageUploadSettings.pathPrefix}
                      onChange={(event) =>
                        setImageUploadSettings((current) => ({
                          ...current,
                          pathPrefix: event.target.value
                        }))
                      }
                      placeholder="uploads"
                      autoComplete="off"
                    />
                  </label>
                  <label className="drawer-field field-span-2">
                    <span>CDN 域名</span>
                    <input
                      className="drawer-text-input"
                      value={imageUploadSettings.cdnHost}
                      onChange={(event) =>
                        setImageUploadSettings((current) => ({
                          ...current,
                          cdnHost: event.target.value
                        }))
                      }
                      placeholder="https://cdn.jsdelivr.net"
                      autoComplete="off"
                    />
                  </label>
                </div>
              </section>
            )}

            <section className="drawer-section">
              <SectionTitle title="编辑体验" />
              <button
                type="button"
                className={settings.syncScroll ? "setting-toggle is-active" : "setting-toggle"}
                aria-pressed={settings.syncScroll}
                onClick={() =>
                  setSettings((current) => ({
                    ...current,
                    syncScroll: !current.syncScroll
                  }))
                }
              >
                <span>双向滚动同步</span>
                <span className="setting-toggle-track">
                  <span className="setting-toggle-thumb" />
                </span>
              </button>
            </section>

            <section className="drawer-section">
              <SectionTitle title="关于作者" />
              <div className="drawer-promo-card" aria-label="Author promotion">
                <div className="drawer-promo-copy">
                  <p className="drawer-promo-kicker">by 青玉白露 (white0dew)</p>
                  <h3>wechat-skill</h3>
                  <p>这个网站由作者制作并持续维护，相关代码和更新记录可在 GitHub 查看。</p>
                  <a
                    className="drawer-promo-link"
                    href="https://github.com/white0dew/wechat-skill"
                    target="_blank"
                    rel="noreferrer"
                  >
                    打开 GitHub 仓库
                  </a>
                </div>
                <div className="drawer-promo-qr">
                  <div className="drawer-promo-qr-trigger">
                    <img src="/wechat-qr.jpg" alt="微信二维码" />
                    <span>微信联系</span>
                  </div>
                  <div className="drawer-promo-qr-popover" aria-hidden="true">
                    <img src="/wechat-qr.jpg" alt="" />
                    <p>扫码添加微信</p>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

        <ThemePickerModal
          open={themeModalOpen}
          themes={availableThemes}
          selectedTheme={selectedTheme}
          modalPreviewMap={modalPreviewMap}
          onClose={() => setThemeModalOpen(false)}
          onSelect={(theme) => {
            setThemeName(theme.name);
            setThemeModalOpen(false);
          }}
          onCreate={createDraftFromSelectedTheme}
        />
      </div>
  );
}
