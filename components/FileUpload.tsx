"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface FileUploadProps {
  value?: File;
  onChange: (file?: File) => void;
  disabled?: boolean;
}

const ACCEPTED = {
  "image/*": [".png", ".jpg", ".jpeg", ".webp"],
  "application/pdf": [".pdf"],
};

/**
 * Reusable drag-and-drop file upload built with react-dropzone.
 * Stores a single File in the field value; the file is uploaded to
 * Appwrite Storage in the server action on submit.
 */
export function FileUpload({ value, onChange, disabled }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      onChange(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } else {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
      }
    },
    [onChange, preview]
  );

  const onRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    },
    [onChange, preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    multiple: false,
    disabled,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div
      {...getRootProps()}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors ${
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-dark-500 bg-dark-400 hover:border-primary/50"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input {...getInputProps()} />

      {value ? (
        <>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              src={preview}
              alt="Uploaded document"
              width={24}
              height={24}
              className="mb-3 max-h-40 w-full rounded-lg object-contain"
            />
          ) : (
            <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-green-500/15">
              <Image
                src="/assets/icons/upload.svg"
                alt="file"
                width={24}
                height={24}
              />
            </div>
          )}

          <p className="max-w-full truncate text-sm font-medium text-light-200">
            {value.name}
          </p>
          <p className="text-xs text-dark-600">
            {(value.size / 1024 / 1024).toFixed(2)} MB
          </p>

          <button
            type="button"
            onClick={onRemove}
            className="mt-3 rounded-full bg-red-500/15 px-4 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/25"
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-green-500/15">
            <Image
              src="/assets/icons/upload.svg"
              alt="upload"
              width={28}
              height={28}
            />
          </div>
          <p className="text-sm font-semibold text-light-200">
            {isDragActive
              ? "Drop the file here"
              : "Drag & drop or click to upload"}
          </p>
          <p className="mt-1 text-xs text-dark-600">
            SVG, PNG, JPG, WEBP or PDF (max 5MB)
          </p>
        </>
      )}
    </div>
  );
}
