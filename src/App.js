import React, { useEffect } from 'react';
import Dashboard from './pages/home';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Addclient from './pages/addclient';
import Updateclient from './pages/updateclient';
import Deleteclient from './pages/deleteclient';
import Pend from './pages/pend';
import Paid from './pages/paid';
import LoginForm from './pages/Loginform';
import Updateform from './pages/updateform';
import EmailForm from './pages/email';
import AddTest from './pages/addtest';
import EmailSender from './pages/emailsender';
import Updaterecord from './pages/updaterecord';
import ProtectedRoute from './pages/ProtectedRoute';
import { UserAuthContextProvider } from './pages/UserAuthContext';
import DataCapacity from './pages/capacity';

function App() {
  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerHeight > window.innerWidth) {
        alert('Please rotate your device to landscape mode to view the page');
      }
    };

    // Initial check on page load
    checkOrientation();

    // Add event listener for orientation change
    window.addEventListener('orientationchange', checkOrientation);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return (
    <>
      <style>
        {`
          @media only screen and (max-width: 600px) and (orientation: portrait) {
            body {
              transform: rotate(90deg);
              transform-origin: left top;
              width: 100vh;
              overflow-x: hidden;
              position: fixed;
              top: 0;
              left: 0;
            }
          }
        `}
      </style>

      <Router>
        <UserAuthContextProvider>
          <Routes>
            <Route index element={<LoginForm />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <Addclient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delete"
              element={
                <ProtectedRoute>
                  <Deleteclient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pend"
              element={
                <ProtectedRoute>
                  <Pend />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paid"
              element={
                <ProtectedRoute>
                  <Paid />
                </ProtectedRoute>
              }
            />
            <Route path="/update" element={<Updateclient />} />
            <Route path="/updateform" element={<Updateform />} />
            <Route path="/email" element={<EmailForm />} />
            <Route path="/addtest" element={<AddTest />} />
            <Route path="/emailsender" element={<EmailSender />} />
            <Route path="/updaterecord" element={<Updaterecord />} />
            <Route path="/capacity" element={<DataCapacity />} />
          </Routes>
        </UserAuthContextProvider>
      </Router>
    </>
  );
}

export default App;
