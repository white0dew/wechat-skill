import { Buffer } from "node:buffer";

export type UploadImageApiEnv = Record<string, string | undefined>;

type UploadImageSettings = {
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  pathPrefix: string;
  cdnHost: string;
};

type UploadFile = {
  arrayBuffer(): Promise<ArrayBuffer>;
  name: string;
  type: string;
};

export type UploadedImage = {
  alt: string;
  path: string;
  url: string;
};

export class UploadApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const uploadEnvMap = {
  githubToken: "MD2WECHAT_GITHUB_TOKEN",
  githubOwner: "MD2WECHAT_GITHUB_OWNER",
  githubRepo: "MD2WECHAT_GITHUB_REPO",
  githubBranch: "MD2WECHAT_GITHUB_BRANCH",
  pathPrefix: "MD2WECHAT_GITHUB_PATH_PREFIX",
  cdnHost: "MD2WECHAT_CDN_HOST"
} satisfies Record<keyof UploadImageSettings, string>;

function readTextField(formData: FormData, field: keyof UploadImageSettings) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function readEnvValue(env: UploadImageApiEnv, field: keyof UploadImageSettings) {
  return env[uploadEnvMap[field]]?.trim() ?? "";
}

function resolveUploadSettings(
  formData: FormData,
  env: UploadImageApiEnv
): UploadImageSettings {
  return {
    githubToken: readEnvValue(env, "githubToken") || readTextField(formData, "githubToken"),
    githubOwner: readEnvValue(env, "githubOwner") || readTextField(formData, "githubOwner"),
    githubRepo: readEnvValue(env, "githubRepo") || readTextField(formData, "githubRepo"),
    githubBranch:
      readEnvValue(env, "githubBranch") || readTextField(formData, "githubBranch") || "main",
    pathPrefix:
      readEnvValue(env, "pathPrefix") || readTextField(formData, "pathPrefix") || "uploads",
    cdnHost:
      readEnvValue(env, "cdnHost") ||
      readTextField(formData, "cdnHost") ||
      "https://cdn.jsdelivr.net"
  };
}

function validateUploadSettings(settings: UploadImageSettings) {
  if (!settings.githubToken) {
    throw new UploadApiError(400, "请先配置 GitHub Token");
  }

  if (!settings.githubOwner || !settings.githubRepo) {
    throw new UploadApiError(400, "请先配置 GitHub 仓库 Owner 和 Repo");
  }

  if (!settings.githubBranch) {
    throw new UploadApiError(400, "请先配置 GitHub 分支名");
  }
}

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
    .filter(Boolean)
    .join("/");
}

function getFileExtension(file: UploadFile) {
  const byName = file.name.split(".").pop()?.toLowerCase();
  if (byName && /^[a-z0-9]+$/.test(byName)) {
    return byName;
  }

  const byType = file.type.split("/").pop()?.toLowerCase();
  if (byType && /^[a-z0-9+.-]+$/.test(byType)) {
    return byType.replace("jpeg", "jpg");
  }

  return "png";
}

function buildFileName(file: UploadFile) {
  const extension = getFileExtension(file);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const slug = baseName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  const randomId =
    "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${slug || "image"}-${randomId}.${extension}`;
}

function buildUploadPath(file: UploadFile, settings: UploadImageSettings) {
  const prefix = sanitizePathSegment(settings.pathPrefix) || "uploads";
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${prefix}/${year}/${month}/${buildFileName(file)}`;
}

function buildAltText(file: UploadFile) {
  return (
    file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ")
      .trim() || "image"
  );
}

function buildContentApiUrl(settings: UploadImageSettings, path: string) {
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://api.github.com/repos/${encodeURIComponent(settings.githubOwner)}/${encodeURIComponent(settings.githubRepo)}/contents/${encodedPath}`;
}

function buildCdnUrl(settings: UploadImageSettings, path: string) {
  const host = settings.cdnHost.replace(/\/+$/g, "") || "https://cdn.jsdelivr.net";
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${host}/gh/${encodeURIComponent(settings.githubOwner)}/${encodeURIComponent(settings.githubRepo)}@${encodeURIComponent(settings.githubBranch)}/${encodedPath}`;
}

function formatGitHubError(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  if ("message" in payload && typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return fallback;
}

function asUploadFile(value: unknown): UploadFile {
  if (!value || typeof value !== "object") {
    throw new UploadApiError(400, "缺少图片文件");
  }

  if (
    "arrayBuffer" in value &&
    typeof value.arrayBuffer === "function" &&
    "name" in value &&
    typeof value.name === "string" &&
    "type" in value &&
    typeof value.type === "string"
  ) {
    return value as UploadFile;
  }

  throw new UploadApiError(400, "缺少图片文件");
}

async function uploadImageToGitHub(file: UploadFile, settings: UploadImageSettings) {
  if (!file.type.startsWith("image/")) {
    throw new UploadApiError(400, "仅支持上传图片文件");
  }

  const path = buildUploadPath(file, settings);
  const content = Buffer.from(await file.arrayBuffer()).toString("base64");
  const response = await fetch(buildContentApiUrl(settings, path), {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${settings.githubToken}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify({
      message: `upload image: ${file.name || path}`,
      content,
      branch: settings.githubBranch
    })
  });

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    throw new UploadApiError(
      502,
      formatGitHubError(payload, `上传失败（${response.status} ${response.statusText}）`)
    );
  }

  return {
    alt: buildAltText(file),
    path,
    url: buildCdnUrl(settings, path)
  };
}

export async function uploadImageFromFormData(
  formData: FormData,
  env: UploadImageApiEnv
): Promise<UploadedImage> {
  const file = asUploadFile(formData.get("file"));
  const settings = resolveUploadSettings(formData, env);
  validateUploadSettings(settings);
  return uploadImageToGitHub(file, settings);
}
