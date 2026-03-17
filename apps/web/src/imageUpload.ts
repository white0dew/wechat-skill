export type ImageUploadSettings = {
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  pathPrefix: string;
  cdnHost: string;
};

export type UploadedImage = {
  alt: string;
  path: string;
  url: string;
};

const STORAGE_KEY = "md2wechat-image-upload-settings";

export function createDefaultImageUploadSettings(): ImageUploadSettings {
  return {
    githubToken: "",
    githubOwner: "",
    githubRepo: "",
    githubBranch: "main",
    pathPrefix: "uploads",
    cdnHost: "https://cdn.jsdelivr.net"
  };
}

export function loadImageUploadSettings(): ImageUploadSettings {
  if (typeof window === "undefined") {
    return createDefaultImageUploadSettings();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultImageUploadSettings();
    }

    return {
      ...createDefaultImageUploadSettings(),
      ...(JSON.parse(raw) as Partial<ImageUploadSettings>)
    };
  } catch {
    return createDefaultImageUploadSettings();
  }
}

export function saveImageUploadSettings(settings: ImageUploadSettings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function appendField(formData: FormData, field: keyof ImageUploadSettings, value: string) {
  const nextValue = value.trim();
  if (nextValue) {
    formData.set(field, nextValue);
  }
}

function formatUploadApiError(payload: unknown, fallback: string) {
  if (!payload) {
    return fallback;
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (typeof payload === "object") {
    if ("error" in payload && typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }

    if ("message" in payload && typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  }

  return fallback;
}

export async function uploadImageFile(
  file: File,
  settings: ImageUploadSettings
): Promise<UploadedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("仅支持上传图片文件");
  }

  const formData = new FormData();
  formData.set("file", file);
  appendField(formData, "githubToken", settings.githubToken);
  appendField(formData, "githubOwner", settings.githubOwner);
  appendField(formData, "githubRepo", settings.githubRepo);
  appendField(formData, "githubBranch", settings.githubBranch);
  appendField(formData, "pathPrefix", settings.pathPrefix);
  appendField(formData, "cdnHost", settings.cdnHost);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: formData
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(formatUploadApiError(payload, `上传失败（${response.status} ${response.statusText}）`));
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("图片上传接口返回异常");
  }

  const alt = "alt" in payload && typeof payload.alt === "string" ? payload.alt : "";
  const path = "path" in payload && typeof payload.path === "string" ? payload.path : "";
  const url = "url" in payload && typeof payload.url === "string" ? payload.url : "";
  if (!path || !url) {
    throw new Error("图片上传接口返回异常");
  }

  return {
    alt,
    path,
    url
  };
}
