import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebaseConfig';
import Table from './table';
import Updateform from './updateform';
import { FaPencilAlt , FaBars, FaHome} from 'react-icons/fa';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Updateclient = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [error, setError] = useState('');

  const columns = [
    // { Header: 'ID', accessor: 'id' }, // Remove this line to hide the ID column
    { Header: 'Name', accessor: 'name' },
    { Header: 'Phone No', accessor: 'phone' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Date', accessor: 'date' },
    { Header: 'Period', accessor: 'period' },
    { Header: 'Return Amount', accessor: 'returnAmount' },
    { Header: 'Return Date', accessor: 'returnDate' },
    { Header: 'Status', accessor: 'status' },
    {
      Header: 'Action',
      accessor: 'update',
      Cell: ({ row }) => (
        <button
        className="bg-blue800 text-white px-4 py-2 rounded-md hover:bg-blue500"
          onClick={() => {
            setSelectedRow(row.original);
          }}
        >
          <FaPencilAlt />
        </button>
      ),
    },
  ];

  const handleUpdate = async (data) => {
    try {
      if (!selectedRow) {
        throw new Error('No row selected for update.');
      }

      console.log('Updating with data:', data);

      const dbRef = ref(db, `lend/${selectedRow.id}`);
      await set(dbRef, { ...selectedRow, ...data });

      console.log('Update successful');
      setSelectedRow(null); // Clear the selected row after update
    } catch (error) {
      setError(`Error updating user: ${error.message}`);
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    const dbRef = ref(db, 'lend');

    const fetchData = async () => {
      try {
        await onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          const clientArray = data ? Object.entries(data).map(([id, values]) => ({ ...values, id })) : [];
          setClients(clientArray);
        });
      } catch (error) {
        setError(`Error fetching data from Realtime Database: ${error.message}`);
        console.error('Error fetching data from Realtime Database:', error);
      }
    };

    fetchData();
  }, []); // Dependency array is empty to fetch data only once

  return (
    <div className="h-screen flex flex-col">
       <nav className="bg-blue900 p-4 flex items-center justify-between">
        <div>
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars />
          </button>
        </div>
        <div className="text-white bg-blue900 font-bold text-lg mx-auto">Lender</div>
      </nav>

      <div className="flex flex-1 overflow-x-hidden">
        <aside
          className={`bg-blue800 p-4 w-64 h-full items-center justify-center transition-transform transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="text-white font-serif hover:bg-yellow p-2  flex items-center">
          <FaHome className='mr-2'/> <Link to="/home">Home</Link>
          </div>
          
        </aside>

        <main className={`flex-1 p-4 bg-blue900 transition-margin ${isMenuOpen ? '' : '-ml-64'}`}>
        <div className="App">
          <h6 className="text-2xl font-italic mb-4">
            {/* Add your title or heading here */}
          </h6>
          {selectedRow ? (
            <Updateform rowData={selectedRow} onUpdate={handleUpdate} />
          ) : (
            <Table columns={columns} data={clients.filter(client => client.status !== 'Paid')} />
          )}
        </div>
      </main>
      </div>

      {error && (
        <div className="text-red-500 mt-4">
          {error}
        </div>
      )}
    </div>
    
  );
};

export default Updateclient;
