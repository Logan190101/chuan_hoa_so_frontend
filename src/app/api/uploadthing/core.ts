import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const uploadthing = createUploadthing({
  errorFormatter: ({ code, message }) => ({ code, message }),
});
const spreadsheetExtensions = [".csv", ".xlsx"];
const maxSpreadsheetFileSize = "32MB";

export const uploadRouter = {
  auditSpreadsheet: uploadthing({
    // This is embedded in the presigned URL. It must be a sensible route limit,
    // not a theoretical storage quota.
    blob: { maxFileCount: 1, maxFileSize: maxSpreadsheetFileSize },
  })
    .middleware(({ files }) => {
      const isSpreadsheet = files.every((file) =>
        spreadsheetExtensions.some((extension) => file.name.toLowerCase().endsWith(extension)),
      );

      if (!isSpreadsheet) {
        throw new UploadThingError("Chỉ hỗ trợ file .xlsx hoặc .csv.");
      }

      return {};
    })
    .onUploadError(({ error, fileKey }) => {
      console.error("UploadThing spreadsheet upload failed", {
        code: error.code,
        fileKey,
        message: error.message,
      });
    })
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
