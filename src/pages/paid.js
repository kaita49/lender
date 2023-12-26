import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from './firebaseConfig';
import { FaBars, FaHome } from 'react-icons/fa';
import Table from './table';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Paid = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  const handleStatusChange = async (clientId) => {
    try {
      // Update the status in the local state
      const updatedClients = clients.map((client) =>
        client.id === clientId ? { ...client, status: 'Paid' } : client
      );
      setClients(updatedClients);

      // Update the status in the Firebase Realtime Database
      const dbRef = ref(db, `lend/${clientId}/status`);
      await set(dbRef, 'Paid');

      console.log('Status updated to Paid');
    } catch (error) {
      setError(`Error updating status: ${error.message}`);
      console.error('Error updating status:', error);
    }
  };

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Date', accessor: 'date' },
    { Header: 'Period', accessor: 'period' },
    { Header: 'Return Amount', accessor: 'returnAmount' },
    { Header: 'Return Date', accessor: 'returnDate' },
    { Header: 'Status', accessor: 'status' },
    
    {
      Header: 'Modify',
      accessor: '',
      Cell: ({ row }) => (
        <button
          onClick={() => handleStatusChange(row.original.id)}
          className="bg-gray500 text-white px-4 py-2 rounded-md hover:bg-green"
        >
          Mark Paid
        </button>
      ),
    },
    {
      Header: 'Image',
      accessor: 'imageUrl',
      Cell: ({ value }) =>
        value && (
          <div className=" flex justify-center text-center"> {/* Add text-center class */}
          <img
            src={
              value.startsWith('https://')
                ? value
                : `https://firebasestorage.googleapis.com/v0/b/lender-d2825.appspot.com/o/images%2F${value}?alt=media`
            }
            alt="Client"
            style={{ width: '50px', height: '50px' }}
          />
          </div>
        ),
    },
    // Add more columns as needed
  ];

  useEffect(() => {
    const dbRef = ref(db, 'lend');

    const fetchData = async () => {
      try {
        await onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          const clientArray = data
            ? Object.entries(data).map(([id, values]) => ({ ...values, id }))
            : [];
          setClients(clientArray);
        });
      } catch (error) {
        setError(`Error fetching data from Realtime Database: ${error.message}`);
        console.error('Error fetching data from Realtime Database:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen flex flex-col">
    {/* Navbar */}
    <nav className="bg-gray800 p-4 flex items-center justify-between">
      <div>
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>
      </div>
      <div className="text-white font-bold text-lg mx-auto">Lender</div>
    </nav>

    {/* Content */}
    <div className="flex flex-1 overflow-x-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray900 p-4 w-64 h-full items-center justify-center transition-transform transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Add your sidebar content here */}
        <div className="text-white font-serif hover:bg-yellow p-2  flex items-center">
          <FaHome className='mr-2'/> <Link to="/">Home</Link>
          </div>
        
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-4 bg-gray200 transition-margin ${isMenuOpen ? '' : '-ml-64'}`}>
        {/* Add your main content here */}
        <div className="App">
          <h6 className="text-2xl font-italic mb-4">
            <i></i>
          </h6>
          
      <Table columns={columns} data={clients.filter(client => client.status !== 'Paid')} />
    
        </div>
      </main>
    </div>
  </div>
);
};

export default Paid;
