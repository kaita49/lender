import React, { useState, useEffect } from 'react';
import { FaBars, FaPlus, FaPencilAlt, FaTrashAlt , FaClock,FaCreditCard} from 'react-icons/fa';
import Table from './table';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import AddClient from './addclient';
import UpdateClient from './updateclient';
import DeleteClient from './deleteclient';
import { ref, onValue } from 'firebase/database';
import { db } from './firebaseConfig';
import Updateform from './updateform';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clients, setClients] = useState([]);

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
      accessor: 'imageUrl' ,
      Cell: ({ value }) => value && (
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
          const clientArray = data ? Object.values(data) : [];
          
          // Sort clients based on the date in descending order (latest first)
          const sortedClients = clientArray.sort((a, b) => new Date(b.date) - new Date(a.date));

          setClients(sortedClients);
        });
      } catch (error) {
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
          <div className="text-white font-serif  hover:bg-yellow  flex items-center">
          <FaPlus className='mr-2'/><Link to="/add">Add Client</Link>
          </div>
          <div className="text-white font-serif  hover:bg-yellow flex items-center">
          <FaPencilAlt className='mr-2'/><Link to="/update"> Update Client</Link>
          </div>
          <div className="text-white font-serif  hover:bg-yellow flex items-center">
          <FaTrashAlt className='mr-2'/> <Link to="/delete">Delete Client</Link>
          </div>

          <div className="text-white font-serif  hover:bg-yellow flex items-center">
          <FaClock className='mr-2'/> <Link to="/pend">Mark Pending</Link>
          </div>
          <div className="text-white font-serif  hover:bg-yellow flex items-center">
          <FaCreditCard className='mr-2'/> <Link to="/paid">Mark Paid</Link>
          </div>
          <Routes>
            <Route path="/add" element={<AddClient />} />
            <Route path="/update" element={<UpdateClient clients={clients} />} />
            <Route path="/delete" element={<DeleteClient />} />
            <Route path="/update1" element={<Updateform />} />
          </Routes>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 bg-gray200 transition-margin ${isMenuOpen ? '' : '-ml-64'}`}>
          {/* Add your main content here */}
          <div className="App">
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

export default Dashboard;
