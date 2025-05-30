import React from 'react';
import Login from './pages/Welcome/Login/Login';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Register from './pages/Welcome/Register/Register';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home/Home';
import './App.css'
import { AnimatePresence } from 'framer-motion';
import { Welcome } from './pages/Welcome/Welcome';


function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/:type' element={<Welcome />} />
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }/>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App;
