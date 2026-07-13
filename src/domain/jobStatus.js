// Mirrors PhotoProcessor.DTO.enums.JobStatus (serialized as numbers).
export const JobStatus = {
    None: 0,
    Queued: 1,
    Running: 2,
    Failed: 3,
    Done: 4,
};

const labels = {
    [JobStatus.None]: "None",
    [JobStatus.Queued]: "Queued",
    [JobStatus.Running]: "Running",
    [JobStatus.Failed]: "Failed",
    [JobStatus.Done]: "Done",
};

export function jobStatusLabel(status) {
    return labels[status] ?? `Unknown (${status})`;
}

export function isJobActive(status) {
    return status === JobStatus.Queued || status === JobStatus.Running;
}
