import React, {MouseEvent} from 'react';

interface Props {
    elementPerPage: number;
    totalElementsQuantity: number;
    maxPageQuantity: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = (props) => {
    const {elementPerPage, totalElementsQuantity, maxPageQuantity, currentPage, onPageChange} = props;

    const totalPageQuantity = Math.ceil(totalElementsQuantity / elementPerPage);

    if (totalPageQuantity < 2) {
        return null;
    }

    const showingPageQuantity = Math.min(maxPageQuantity, totalPageQuantity);

    let startPage = currentPage - Math.floor((showingPageQuantity - 1) / 2);
    let endPage = currentPage + Math.floor(showingPageQuantity / 2);

    if (startPage < 1) {
        endPage += 1 - startPage;
        startPage = 1;
    }

    if (endPage > totalPageQuantity) {
        startPage -= endPage - totalPageQuantity;
        endPage = totalPageQuantity;
    }

    const showPrevLink = currentPage > 1;
    const showNextLink = currentPage < totalPageQuantity;

    const pages = new Array(endPage - startPage + 1)
        .fill(startPage)
        .map((value, index) => value + index);

    const handlePageClick = (page: number) => (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onPageChange(page);
    }

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {showPrevLink &&
                <li key="prev" className="page-item">
                    <button onClick={handlePageClick(currentPage - 1)} className="page-link">
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>
                }

                {pages.map(page => {
                    return page === currentPage ?
                        <li key={page} className="page-item active">
                            <button className="page-link">{page}</button>
                        </li> :
                        <li key={page} className="page-item">
                            <button onClick={handlePageClick(page)} className="page-link">{page}</button>
                        </li>
                })}


                {showNextLink &&
                <li key="next" className="page-item">
                    <button onClick={handlePageClick(currentPage + 1)} className="page-link">
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
                }
            </ul>
        </nav>
    );
};

export default React.memo(Pagination);