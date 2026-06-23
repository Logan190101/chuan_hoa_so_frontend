"use client";

import { useRef, type ChangeEvent, type DragEvent } from "react";

import { FileIcon, TableIcon } from "@/components/core/icons";
import { cn } from "@/lib/cn";

type FileDropzoneProps = {
  disabled: boolean;
  file: File | null;
  onFileChange: (file: File | null) => void;
};

const acceptedFileTypes = [".xlsx", ".csv"];

export function FileDropzone({ disabled, file, onFileChange }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function selectFile(nextFile: File | undefined) {
    if (!nextFile || disabled) return;
    const extension = `.${nextFile.name.split(".").pop()?.toLowerCase()}`;
    if (acceptedFileTypes.includes(extension)) onFileChange(nextFile);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    selectFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#c3c6d6]/60 bg-white p-1 shadow-[0_2px_4px_rgba(9,30,66,0.08)]">
      <div className="absolute left-0 top-0 h-1 w-full bg-[#e1e2e4]" />
      <div className="flex flex-1 items-center justify-center p-5 sm:p-8">
        <div
          aria-disabled={disabled}
          className={cn(
            "relative flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-8 text-center transition",
            disabled
              ? "cursor-not-allowed border-[#d9dadc] bg-[#f3f4f6] text-[#737685]"
              : "cursor-pointer border-[#c1c7d0] bg-white hover:border-[#0052cc] hover:bg-[#f3f6ff]",
          )}
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(event) => !disabled && event.preventDefault()}
          onDrop={handleDrop}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(event) => {
            if (!disabled && (event.key === "Enter" || event.key === " ")) inputRef.current?.click();
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:radial-gradient(#003d9b_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className={cn("relative mb-6 rounded-full bg-white p-4 shadow-sm", disabled && "opacity-55")}>
            <FileIcon className="size-12 text-[#0c56d0]" strokeWidth={1.6} />
          </div>
          {file ? (
            <>
              <h3 className="relative text-lg font-semibold text-[#191c1e]">{file.name}</h3>
              <p className="relative mt-2 text-sm text-[#434654]">File đã sẵn sàng để đối soát.</p>
              <button
                className="relative mt-5 text-sm font-semibold text-[#003d9b] hover:underline"
                onClick={(event) => { event.stopPropagation(); onFileChange(null); }}
                type="button"
              >
                Chọn file khác
              </button>
            </>
          ) : (
            <>
              <h3 className="relative text-lg font-semibold text-[#191c1e]">Kéo thả file dữ liệu vào đây</h3>
              <p className="relative mt-2 max-w-md text-sm text-[#434654]">
                {disabled ? "Chọn lĩnh vực trước khi tải file." : <>hoặc <span className="font-semibold text-[#003d9b]">duyệt thư mục</span> để chọn file từ máy tính của bạn.</>}
              </p>
            </>
          )}
          <div className="relative mt-6 flex items-center gap-2 rounded-full border border-[#c3c6d6]/40 bg-[#f3f4f6] px-4 py-2 text-xs font-semibold text-[#434654]">
            <TableIcon className="size-4 text-[#006c47]" />
            Hỗ trợ file .xlsx, .csv
          </div>
          <input accept=".xlsx,.csv" className="sr-only" disabled={disabled} onChange={handleInputChange} ref={inputRef} type="file" />
        </div>
      </div>
    </div>
  );
}
