// Mirrors PhotoProcessor.DTO.enums.JobTypes (serialized as numbers).
export const JobType = {
    None: 0,
    FaceRecognition: 1,
    VideoTranscode: 2,
    ImageEmbedding: 3,
    VideoKeyframes: 4,
};

const jobTypeLabels = {
    [JobType.None]: "None",
    [JobType.FaceRecognition]: "Face recognition",
    [JobType.VideoTranscode]: "Video transcode",
    [JobType.ImageEmbedding]: "Image embedding (CLIP)",
    [JobType.VideoKeyframes]: "Video keyframes",
};

export function jobTypeLabel(jobType) {
    return jobTypeLabels[jobType] ?? `Unknown (${jobType})`;
}

// Mirrors PhotoProcessor.DTO.enums.MediaItemType.
export const MediaItemType = {
    None: 0,
    Photo: 1,
    Video: 2,
    Frame: 3,
};

const mediaTypeLabels = {
    [MediaItemType.Photo]: "photos",
    [MediaItemType.Video]: "videos",
    [MediaItemType.Frame]: "video frames",
};

export function mediaTypeLabel(mediaType) {
    return mediaTypeLabels[mediaType] ?? `type ${mediaType}`;
}
