import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const uploadthing = createUploadthing();
const spreadsheetExtensions = [".csv", ".xlsx"];

export const uploadRouter = {
  auditSpreadsheet: uploadthing({
    // UploadThing requires a route maximum. This deliberately uses its highest
    // configurable value; the effective ceiling is determined by the account plan.
    blob: { maxFileCount: 1, maxFileSize: "1024GB" },
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
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
