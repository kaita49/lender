import React, { useState, useEffect } from 'react';
import { FaBars, FaTrash, FaHome } from 'react-icons/fa';
import { ref, onValue, remove } from 'firebase/database';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { db, storage } from './firebaseConfig';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import AddClient from './addclient';
import UpdateClient from './updateclient';
import Table from './table';
import Dashboard from './home';
import './Deleteclient.css'; // Import the CSS file with the animation styles

const Deleteclient = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [deletedClient, setDeletedClient] = useState(null);

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Phone No', accessor: 'phone' },
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
    {
      Header: 'Action',
      accessor: 'delete',
      Cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original)}
          className="text-gray500 hover:text-red600 focus:outline-none"
        >
          <FaTrash   style={{ width: '30px', height: '30px' }}/>
        </button>
      ),
    },
  ];

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
        console.error('Error fetching data from Realtime Database:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (client) => {
    try {
      const clientRef = ref(db, `lend/${client.id}`);
      await remove(clientRef);

      const storagePath = `images/${client.imageUrl}`;
      const storageReference = storageRef(storage, storagePath);
      await deleteObject(storageReference);

      setClients((prevClients) => prevClients.filter((c) => c.id !== client.id));
      setDeletedClient(client);

      setTimeout(() => {
        setDeletedClient(null);
      }, 3000); // Adjust the timeout duration as needed
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
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

      <div className="flex flex-1 overflow-x-hidden">
        <aside
          className={`bg-gray900 p-4 w-64 h-full items-center justify-center transition-transform transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="text-white font-serif hover:bg-yellow p-2  flex items-center">
          <FaHome className='mr-2'/> <Link to="/">Home</Link>
          </div>
          
        </aside>

        <main className={`flex-1 p-4 bg-gray200 transition-margin ${isMenuOpen ? '' : '-ml-64'}`}>
          <div className="App">
            {deletedClient && (
              <div>
                <div className="delete-message">
                  
                </div>
                <div className="delete-line"></div>
              </div>
            )}
            <h6 className="text-2xl font-italic mb-4">
              <i></i>
            </h6>
            <Table columns={columns} data={clients} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Deleteclient;
