import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMediaItemPage, useUploadPhotos } from "../hooks/useMediaItems";
import { useSearch } from "../hooks/useSearch";
import PhotoCard from "../components/PhotoCard";
import Pagination from "../components/Pagination";
import UploadButton from "../components/UploadButton";
import usePageTitle from "../hooks/usePageTitle";

const PAGE_SIZE = 24;

export default function GalleryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const query = searchParams.get("q") ?? "";
    const isSearching = query.trim().length > 0;

    const [searchText, setSearchText] = useState(query);
    useEffect(() => setSearchText(query), [query]);

    const { data, isLoading, isError, error } = useMediaItemPage(page, PAGE_SIZE);
    const search = useSearch(query, PAGE_SIZE);

    usePageTitle(isSearching ? `Search: ${query}` : "Photos");

    function onSearchSubmit(event) {
        event.preventDefault();
        const next = searchText.trim();
        setSearchParams(next ? { q: next } : {});
    }

    function clearSearch() {
        setSearchText("");
        setSearchParams({});
    }

    const uploadMutation = useUploadPhotos();
    const [progress, setProgress] = useState({ done: 0, total: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const upload = {
        isPending: uploadMutation.isPending,
        isError: uploadMutation.isError,
        error: uploadMutation.error,
        start: (files) => {
            setProgress({ done: 0, total: files.length });
            uploadMutation.mutate({
                files,
                onProgress: (done, total) => setProgress({ done, total }),
            });
        },
    };

    const uploadResults = uploadMutation.data;
    const duplicateCount = uploadResults?.filter((r) => r.duplicate).length ?? 0;
    const uploadSummary =
        uploadResults && !uploadMutation.isPending
            ? `${uploadResults.length - duplicateCount} uploaded` +
              (duplicateCount > 0 ? `, ${duplicateCount} already in your library` : "")
            : null;

    function onDragOver(event) {
        event.preventDefault();
        setIsDragging(true);
    }

    function onDrop(event) {
        event.preventDefault();
        setIsDragging(false);

        const files = Array.from(event.dataTransfer?.files ?? []).filter((file) =>
            file.type.startsWith("image/") || file.type.startsWith("video/"),
        );
        if (files.length > 0) {
            upload.start(files);
        }
    }

    return (
        <section className="dropzone" onDragOver={onDragOver} onDragLeave={() => setIsDragging(false)} onDrop={onDrop}>
            {isDragging && <div className="dropzone-overlay">Drop photos to upload</div>}

            <div className="page-header">
                <div>
                    <h1>Photos</h1>
                    {!isSearching && data && <span className="muted">{data.totalCount} photo{data.totalCount === 1 ? "" : "s"}</span>}
                </div>
                <UploadButton upload={upload} progress={progress} />
            </div>

            <form className="search-form" onSubmit={onSearchSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search your photos — try “a cat” or “a rocket launching”"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                />
                <button type="submit" className="primary">Search</button>
                {isSearching && <button type="button" onClick={clearSearch}>Clear</button>}
            </form>

            {uploadSummary && <p className="muted">{uploadSummary}</p>}

            {isSearching ? (
                <>
                    {search.isLoading && <p className="muted">Searching…</p>}
                    {search.isError && <p className="error-text">{search.error.message}</p>}
                    {search.data && (
                        <>
                            <p className="muted">
                                {search.data.length === 0
                                    ? `Nothing in your library matches “${query}”.`
                                    : `${search.data.length} match${search.data.length === 1 ? "" : "es"} for “${query}”`}
                            </p>
                            <div className="photo-grid">
                                {search.data.map((item) => (
                                    <PhotoCard key={item.mediaItemId} mediaItem={item} />
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    {isLoading && <p className="muted">Loading photos…</p>}
                    {isError && <p className="error-text">{error.message}</p>}
                    {data && data.items.length === 0 && (
                        <p className="muted">No photos yet — drop some here to get started.</p>
                    )}

                    {data && (
                        <>
                            <div className="photo-grid">
                                {data.items.map((item) => (
                                    <PhotoCard key={item.mediaItemId} mediaItem={item} />
                                ))}
                            </div>
                            <Pagination
                                page={page}
                                pageSize={PAGE_SIZE}
                                totalCount={data.totalCount}
                                onPageChange={(next) => setSearchParams({ page: String(next) })}
                            />
                        </>
                    )}
                </>
            )}
        </section>
    );
}
