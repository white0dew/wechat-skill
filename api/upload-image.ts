import type { IncomingMessage, ServerResponse } from "node:http";
import { handleUploadNodeRequest } from "../apps/web/server/imageUploadApi";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await handleUploadNodeRequest(req, res, process.env);
}
