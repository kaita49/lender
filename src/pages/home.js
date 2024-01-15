import React, { useState, useEffect } from 'react';
import { FaBars, FaPlus, FaPencilAlt, FaTrashAlt, FaClock, FaCreditCard, FaSignOutAlt, FaCheckCircle, FaBolt } from 'react-icons/fa';
import Table from './table';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import AddClient from './addclient';
import UpdateClient from './updateclient';
import DeleteClient from './deleteclient';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import Updateform from './updateform';
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useUserAuth } from './UserAuthContext';
import { Chart } from 'react-google-charts';



const formatStorage = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};


const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [activeClients, setActiveClients] = useState(0);
  const [pendingClients, setPendingClients] = useState(0);
  const [paidClients, setPaidClients] = useState(0);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [usedStorage, setUsedStorage] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);


  

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
      Header: 'Image',
      accessor: 'imageUrl',
      Cell: ({ value }) => value && (
        <div className="flex justify-center rounded-md text-center">
          <img
            src={
              value.startsWith('https://')
                ? value
                : `https://firebasestorage.googleapis.com/v0/b/lender-d2825.appspot.com/o/images%2F${value}?alt=media`
            }
            alt="......"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        </div>
      ),
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setSelectedMenuItem(null);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(drawCharts);
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [clients]);

  const drawCharts = () => {
    drawLineChart();
    drawPieChart();
  };

 

const drawLineChart = () => {
  const data = new window.google.visualization.DataTable();
  data.addColumn('date', 'Date');
  data.addColumn('number', 'Amount');

  const recentClients = clients.slice(0, 5); // Only consider the recent 5 clients

  recentClients.forEach((client) => {
    const amount = Math.max(parseFloat(client.amount), 0); // Ensure non-negative amount
    data.addRow([new Date(client.date), amount]);
  });

  const options = {
    title: 'Client Amount Trend',
    curveType: 'function',
    legend: { position: 'bottom' },
    chartArea: { width: '80%', height: '60%' },
    vAxis: {
      minValue: 0, // Ensure the y-axis starts from 0
      viewWindow: {
        min: 0, // Ensure no negative values are displayed below zero
      },
    },
    hAxis: {
      format: 'MMM dd', // Format for the x-axis labels
    },
  };

  const chart = new window.google.visualization.LineChart(document.getElementById('line_chart_div'));
  chart.draw(data, options);
};




  const drawPieChart = () => {
    const data = new window.google.visualization.DataTable();
    data.addColumn('string', 'Status');
    data.addColumn('number', 'Count');
    data.addRows([
      ['Active', activeClients],
      ['Pending', pendingClients],
      ['Paid', paidClients],
    ]);

    const options = {
      title: 'Client Status Distribution',
      chartArea: { width: '80%', height: '60%' },
    };

    const chart = new window.google.visualization.PieChart(document.getElementById('pie_chart_div'));
    chart.draw(data, options);
  };

  useEffect(() => {
    const dbRef = ref(db, 'lend');

    const fetchData = async () => {
      try {
        await onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          const clientArray = data ? Object.values(data) : [];
          const sortedClients = clientArray.sort((a, b) => new Date(b.date) - new Date(a.date));
          setClients(sortedClients);

          const active = sortedClients.filter((client) => client.status === 'active').length;
          const pending = sortedClients.filter((client) => client.status === 'Pending').length;
          const paid = sortedClients.filter((client) => client.status === 'Paid').length;

          setActiveClients(active);
          setPendingClients(pending);
          setPaidClients(paid);

          let usedStorage = 0;
          sortedClients.forEach((client) => {
            usedStorage += JSON.stringify(client).length;
          });

          setUsedStorage(usedStorage);
          setTotalStorage(524288000);
        });
      } catch (error) {
        console.error('Error fetching data from Realtime Database:', error);
      }
    };

    fetchData();
  }, []);

  const history = useNavigate();
  const navigate = useNavigate();

  return (
    <div className="  h-screen flex flex-col overflow-x-visible   bg-blue900">
      <nav className="bg-blue900 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars />
          </button>
        </div>

        <div className="text-white font-bold text-lg mx-auto flex-grow text-center">Lender.</div>

        <div className="ml-auto relative">
          <button
            className="text-white focus:outline-none"
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
          >
            <FaSignOutAlt className="mr-2" />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-x-hidden">
        <aside
          className={`bg-blue800 p-4 w-64 rounded-md  items-center justify-center transition-transform transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
           <div className="text-white font-serif bg-blue900 justify-center mb-2 hover:bg-blue500 flex items-center rounded-full p-2">
            <FaPlus className='mr-2'/><Link to="/add">Add Client</Link>
          </div>
          <div className="text-white font-serif bg-blue900 justify-center mb-2 hover:bg-blue500 flex items-center rounded-full p-2">
            <FaPencilAlt className='mr-2'/><Link to="/update"> Update Client</Link>
          </div>
          <div className="text-white font-serif bg-blue900 justify-center mb-2 hover:bg-blue500 flex items-center rounded-full p-2">
            <FaTrashAlt className='mr-2'/> <Link to="/delete">Delete Client</Link>
          </div>
          <div className="text-white font-serif bg-blue900 justify-center mb-2 hover:bg-blue500 flex items-center rounded-full p-2">
            <FaClock className='mr-2'/> <Link to="/pend">Mark Pending</Link>
          </div>
          <div className="text-white font-serif bg-blue900 justify-center hover:bg-blue500 flex items-center rounded-full p-2">
  <FaCheckCircle className='mr-2'/> 
  <Link to="/paid">Mark Paid</Link>
</div>

         
         
          
          <Routes>
            <Route path="/add" element={<AddClient />} />
            <Route path="/update" element={<UpdateClient clients={clients} />} />
            <Route path="/delete" element={<DeleteClient />} />
            <Route path="/update1" element={<Updateform />} />
          </Routes>
        </aside>

        <main className={`flex-1 p-4 bg-blue900 transition-margin ${isMenuOpen ? '' : '-ml-64'}`}>
          <div className="App">
            <div className="flex flex-wrap justify-center mb-4">
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
                <div className="bg-blue800 text-white p-4 rounded-md text-center">
                  <p className="text-2xl font-bold">{activeClients}</p>
                  <p>Active <FaBolt /></p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
                <div className="bg-blue800 p-4 text-white rounded-md text-center">
                  <p className="text-2xl font-bold">{pendingClients}</p>
                  <p>Pending <FaClock /></p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
                <div className="bg-blue800 text-white p-4 rounded-md text-center">
                  <p className="text-2xl font-bold">{paidClients}</p>
                  <p>Paid <FaCheckCircle /></p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center mb-4">
              <div className="w-full  bg-blue800 sm:w-1/2 p-4">
                <div id="line_chart_div"></div>
              </div>
              <div className="w-full bg-blue800 sm:w-1/2 p-4">
                <div id="pie_chart_div"></div>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
                <div className="bg-blue800 text-white p-4 rounded-md text-center">
                  <p className="text-2xl font-bold">{(usedStorage / totalStorage * 100).toFixed(4)}%</p>
                  <p>Storage Used</p>
                  <p>({formatStorage(usedStorage)} / {formatStorage(totalStorage)})</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center mb-4 ">
              {selectedMenuItem === "add" && <AddClient />}
              {selectedMenuItem === "update" && <UpdateClient clients={clients} />}
              {selectedMenuItem === "delete" && <DeleteClient />}
              <div className="flex justify-center mb-4 overflow-x-auto">
              {!selectedMenuItem && <Table className="bg-blue900  rounded-lg shadow" columns={columns} data={clients} />}
              </div>
            </div>
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default Dashboard;
