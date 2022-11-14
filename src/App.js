
import './App.css';
import {  Routes, BrowserRouter, Route } from 'react-router-dom';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddRoomModals from './components/Modals/AddRoomModals';
import InviteMemberModal from './components/Modals/InviteMemberModal';
function App() {
  return <BrowserRouter>
    <AuthProvider>
     <AppProvider>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<ChatRoom />} path="/" />
      </Routes>
      <AddRoomModals />
      <InviteMemberModal />
     </AppProvider>
    </AuthProvider>
     
  </BrowserRouter> 
  
  
}

export default App;
