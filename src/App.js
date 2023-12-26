import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/home';
import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import Addclient from './pages/addclient';
import Updateclient from './pages/updateclient';
import Deleteclient from './pages/deleteclient';
import Test from './pages/test';
import Updateform from './pages/updateform';

import Pend from './pages/pend';
import Paid from './pages/paid';
import EmailForm from './pages/email';
import AddTest from './pages/addtest';
import EmailSender from './pages/emailsender';

function App() {
  return (
  <Router>
    
    <Routes>
      
      <Route index element={<Dashboard />}/>
      <Route path="/add" element={<Addclient/>}/>
      <Route path="/update" element={<Updateclient/>}/>
      <Route path="/delete" element={<Deleteclient/>}/>
      <Route path="/updateform" element={<Updateform/>}/>
      <Route path="/pend" element={<Pend/>}/>
      <Route path="/paid" element={<Paid/>}/>
      <Route path="/email" element={<EmailForm/>}/>

      <Route path="/addtest" element={<AddTest/>}/>
      <Route path="/emailsender" element={<EmailSender/>}/>
     
      <Route path="/t1" element={<Test/>}/>
      
      
    </Routes>


  </Router>
    
   
    
    
    
 
  );
}

export default App;
