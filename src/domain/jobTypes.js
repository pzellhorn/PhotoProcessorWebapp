// Mirrors PhotoProcessor.DTO.enums.JobTypes (serialized as numbers).
export const JobType = {
    None: 0,
    FaceRecognition: 1,
    VideoTranscode: 2,
    ImageEmbedding: 3,
};

const jobTypeLabels = {
    [JobType.None]: "None",
    [JobType.FaceRecognition]: "Face recognition",
    [JobType.VideoTranscode]: "Video transcode",
    [JobType.ImageEmbedding]: "Image embedding (CLIP)",
};

export function jobTypeLabel(jobType) {
    return jobTypeLabels[jobType] ?? `Unknown (${jobType})`;
}

// Mirrors PhotoProcessor.DTO.enums.MediaItemType.
export const MediaItemType = {
    None: 0,
    Photo: 1,
    Video: 2,
};

const mediaTypeLabels = {
    [MediaItemType.Photo]: "photos",
    [MediaItemType.Video]: "videos",
};

export function mediaTypeLabel(mediaType) {
    return mediaTypeLabels[mediaType] ?? `type ${mediaType}`;
}
