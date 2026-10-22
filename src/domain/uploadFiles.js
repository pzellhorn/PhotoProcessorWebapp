// Camera raws browsers don't report as image/*. Mirrors the extensions the API accepts as photos.
export const RAW_PHOTO_EXTENSIONS = [".nef"];

const JPEG_EXTENSIONS = [".jpg", ".jpeg"];

export const UPLOAD_ACCEPT = [
  "image/*",
  "video/*",
  ...RAW_PHOTO_EXTENSIONS,
].join(",");

export function isUploadableFile(file) {
  return (
    file.type.startsWith("image/") ||
    file.type.startsWith("video/") ||
    hasExtension(file, RAW_PHOTO_EXTENSIONS)
  );
}

// For uploads containing both the NEF and jpeg, only upload the NEF
export function withoutRawTwins(files) {
  const rawNames = new Set(
    files
      .filter((file) => hasExtension(file, RAW_PHOTO_EXTENSIONS))
      .map(nameWithoutExtension),
  );
  return files.filter(
    (file) =>
      !(
        hasExtension(file, JPEG_EXTENSIONS) &&
        rawNames.has(nameWithoutExtension(file))
      ),
  );
}

function hasExtension(file, extensions) {
  const name = file.name.toLowerCase();
  return extensions.some((extension) => name.endsWith(extension));
}

function nameWithoutExtension(file) {
  const name = file.name.toLowerCase();
  const dot = name.lastIndexOf(".");
  return dot === -1 ? name : name.slice(0, dot);
}
