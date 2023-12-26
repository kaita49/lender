import React, { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from './firebaseConfig';
import { FaBars, FaHome } from 'react-icons/fa';
import Table from './table';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const columns = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Amount', accessor: 'amount' },
  { Header: 'Date', accessor: 'date' },
  { Header: 'Period', accessor: 'period' },
  { Header: 'Return Amount', accessor: 'returnAmount' },
  { Header: 'Return Date', accessor: 'returnDate' },
  { Header: 'Status', accessor: 'status' },
  {
    Header: 'Image',
    accessor: 'imageUrl',
    Cell: ({ value }) =>
      value && (
        <img
          src={
            value.startsWith('https://')
              ? value
              : `https://firebasestorage.googleapis.com/v0/b/lender-d2825.appspot.com/o/images%2F${value}?alt=media`
          }
          alt="Client"
          style={{ width: '50px', height: '50px' }}
        />
      ),
  },
];

const Test = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  const fetchDataAndHandleStatusUpdates = async () => {
    try {
      const dbRef = ref(db, 'lend');
      const snapshot = await get(dbRef);
      const data = snapshot.val();
      const clientArray = data
        ? Object.entries(data).map(([id, values]) => ({ ...values, id }))
        : [];

      // Update status for clients with returnDate equal to current date and status not paid
      const currentDate = new Date();
      const updatedClients = clientArray.map((client) => {
        if (
          client.returnDate === currentDate.toISOString().split('T')[0] &&
          client.status !== 'Paid'
        ) {
          // Update status to 'Pending'
          const dbStatusRef = ref(db, `lend/${client.id}/status`);
          set(dbStatusRef, 'Pending');

          return { ...client, status: 'Pending' };
        }
        return client;
      });

      setClients(updatedClients);
    } catch (error) {
      setError(`Error fetching data from Realtime Database: ${error.message}`);
      console.error('Error fetching data from Realtime Database:', error);
    }
  };

  useEffect(() => {
    // Fetch data and handle status updates on page load
    fetchDataAndHandleStatusUpdates();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-gray800 p-4 flex items-center justify-between">
        <div>
          <button className="text-white focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaBars />
          </button>
        </div>
        <div className="text-white font-bold text-lg mx-auto">Lender</div>
      </nav>

      <div className="flex flex-1 overflow-x-hidden">
        <aside
          className={`bg-gray900 p-4 w-64 h-full items-center justify-center transition-transform transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="text-white font-serif hover:bg-yellow p-2  flex items-center">
            <FaHome className="mr-2" /> <Link to="/">Home</Link>
          </div>
        </aside>

        <main className={`flex-1 p-4 bg-gray200 transition-margin ${isMenuOpen ? '' : '-ml-64'}`}>
          <div className="App">
            <h6 className="text-2xl font-italic mb-4">
              <i></i>
            </h6>
            <Table columns={columns} data={clients.filter((client) => client.status !== 'Paid')} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Test;
