import { NextResponse } from "next/server";
import { UploadApiError, uploadImageFromFormData } from "../../../server/uploadImageCore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploaded = await uploadImageFromFormData(formData, process.env);
    return NextResponse.json(uploaded);
  } catch (error) {
    if (error instanceof UploadApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ error: "图片上传接口异常" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
