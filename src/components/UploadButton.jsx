import { useRef } from "react";

export default function UploadButton({ upload, progress }) {
  const inputRef = useRef(null);

  function onFilesChosen(event) {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      upload.start(files);
    }
    event.target.value = "";
  }

  return (
    <div className="upload-button">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={onFilesChosen}
      />
      <button
        className="primary"
        disabled={upload.isPending}
        onClick={() => inputRef.current?.click()}
      >
        {upload.isPending
          ? `Uploading ${progress.done + 1}/${progress.total}…`
          : "Upload media"}
      </button>
      {upload.isError && (
        <span className="error-text">{upload.error.message}</span>
      )}
    </div>
  );
}
