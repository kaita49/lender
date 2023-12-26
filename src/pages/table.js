import React, { useState, useEffect } from 'react';
import { useTable, useGlobalFilter, usePagination } from 'react-table';

const Table = ({ columns, data }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, globalFilter },
    setGlobalFilter,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    pageCount,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 4 } },
    useGlobalFilter,
    usePagination
  );

  useEffect(() => {
    const handleResize = () => {
      // Handle resize logic if needed
    };

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className={`w-full p-2 border rounded-md ${
            isSearchFocused ? 'border-gray-300' : 'border-blue-300'
          }`}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>
      <table
        {...getTableProps()}
        className="min-w-full border border-collapse border-gray-300"
      >
        <thead className="bg-gray-100">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="p-2 border-b">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={{ height: '60px' }} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="p-2 border-b align-top">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination mt-4">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<< First'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'< Prev'}
        </button>{' '}
        {pageOptions.map((page, index) => (
          <button
            key={index}
            onClick={() => gotoPage(index)}
            className={`mx-2 p-2 border rounded ${
              pageIndex === index ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'Next >'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'Last >>'}
        </button>{' '}
      </div>
    </div>
  );
};

export default Table;
