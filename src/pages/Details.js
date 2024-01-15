// Import necessary components and libraries
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Details = () => {
  const { id } = useParams();
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    // Fetch data for the specific row based on the id
    // You'll need to replace this with your actual data fetching logic
    const fetchData = async () => {
      // Replace this with your actual data fetching logic
      const row = await fetchRowById(id);
      setRowData(row);
    };

    fetchData();
  }, [id]);

  // Replace this with your actual data fetching logic
  const fetchRowById = async (id) => {
    // Assuming data is an array of rows
    const row = data.find((item) => item.id === id);
    return row;
  };

  // Check if data is still loading
  if (!rowData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Details for Row {id}</h2>
      <table className="table table-bordered table-dark">
        <tbody>
          {Object.entries(rowData).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Details;
