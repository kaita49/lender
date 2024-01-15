import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebaseConfig';
import { FaBars, FaHome, FaBolt, FaCheckCircle, FaClock } from 'react-icons/fa';
import Table from './table';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Pend = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  const handleStatusChange = async (clientId) => {
    try {
      // Update the status in the local state
      const updatedClients = clients.map((client) =>
        client.id === clientId ? { ...client, status: 'Pending' } : client
      );
      setClients(updatedClients);

      // Update the status in the Firebase Realtime Database
      const dbRef = ref(db, `lend/${clientId}/status`);
      await set(dbRef, 'Pending');

      console.log('Status updated to Pending');
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
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <div className="flex items-center">
          {value === 'active' && <FaBolt className="mr-2" />}
          {value === 'Pending' && <FaClock className="mr-2" />}
          {value === 'Paid' && <FaCheckCircle className="mr-2" />}
          <span>{value}</span>
        </div>
      ),
    },
    
    {
      Header: 'Modify',
      accessor: '',
      Cell: ({ row }) => (
        <button
          onClick={() => handleStatusChange(row.original.id)}
          className="bg-blue800 text-white px-4 py-2 rounded-md flex hover:bg-blue500"
        >
         <FaClock className="mr-2" /> Mark Pending
        </button>
      ),
    },
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
    <div className="h-screen bg-blue900 flex flex-col">
    {/* Navbar */}
    <nav className="bg-blue900 p-4 flex items-center justify-between">
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
        className={`bg-blue800 p-4 w-64 h-full items-center justify-center transition-transform transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Add your sidebar content here */}
        <div className="text-white font-serif bg-blue900 justify-center mb-2 hover:bg-blue500 flex items-center rounded-full p-2">
          <FaHome className='mr-2'/> <Link to="/home">Home</Link>
          </div>
        
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-4 bg-blue900 transition-margin ${isMenuOpen ? '' : '-ml-64'}`}>
        {/* Add your main content here */}
        <div className="App">
          <h6 className="text-2xl font-italic mb-4">
            <i></i>
          </h6>
          
          <Table columns={columns}  data={clients.filter(client => client.status !== 'Pending')} />
         
        </div>
      </main>
    </div>
  </div>
);
};

export default Pend;
