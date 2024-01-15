import React, { useState, useEffect } from 'react';
import { useTable, useGlobalFilter, usePagination } from 'react-table';
import './Table.css'

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
      <div className="mb-4 bg-blue900">
        <input
          type="text"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className={`w-full p-2 border text-white  bg-blue900 rounded-md ${
            isSearchFocused ? 'border-blue900' : 'border-blue500'
          }`}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>
      <div style={{ }}>
        
        <table
          {...getTableProps()}
          className="min-w-full text-sm table-auto border bg-blue900 text-white border-blue900 overflow-x-auto sm:rounded-lg md:shadow-md "
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
      </div>
      <div className="pagination mt-4">
        <button className="text-white" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<< First'}
        </button>{' '}
        <button className="text-white" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'< Prev'}
        </button>{' '}
        {pageOptions.map((page, index) => (
          <button 
            key={index}
            onClick={() => gotoPage(index)}
            className={`mx-2 p-2 border rounded text-white ${
              pageIndex === index ? 'bg-blue900 text-yellow' : ''
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button className="text-white" onClick={() => nextPage()} disabled={!canNextPage}>
          {'Next >'}
        </button>{' '}
        <button className="text-white" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'Last >>'}
        </button>{' '}
      </div>
    </div>
  );
};

export default Table;