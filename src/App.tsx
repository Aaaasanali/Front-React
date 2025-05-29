import React from 'react';
import Login from './pages/Login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register/Register';
import PrivateRoute from './components/PrivateRoute';
import LogoutBtn from './components/LogoutBtn';
import Home from './pages/Home/Home';
import './App.css'
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
          <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
          }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
