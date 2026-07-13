export default function Pagination({ page, pageSize, totalCount, onPageChange }) {
    const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
    if (pageCount <= 1) return null;

    return (
        <div className="pagination">
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                Previous
            </button>
            <span className="muted">
                Page {page} of {pageCount}
            </span>
            <button disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
                Next
            </button>
        </div>
    );
}
