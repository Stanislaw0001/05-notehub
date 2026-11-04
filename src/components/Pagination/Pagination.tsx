import ReactPaginateModule, { type ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';
import css from './Pagination.module.css';

const ReactPaginate = (
    ReactPaginateModule as unknown as {
        default: ComponentType<ReactPaginateProps>;
    }
).default;

interface PaginationProps {
    totalPages: number;
    page: number;
    setPage: (nextPage: number) => void;
}

export default function Pagination({ totalPages, page, setPage }: PaginationProps) {
    return (
        <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
        />

    );
}