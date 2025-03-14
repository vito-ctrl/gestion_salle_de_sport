import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Register from './Auth/Register';
import Login from './Auth/Login';
import Reservation from './pages/Reservation';
import User from './pages/user';
import PrivateRoutes from './Auth/PrivetRoutes';
import AdmineRoutes from './Auth/AdmineRoutes';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route element={<AdmineRoutes/>}>
          <Route element = {<Reservation/>} path='/reservation'/>
        </Route>
        <Route  element={<PrivateRoutes/>}>
          <Route element = {<User/>} path='/user'/>
        </Route>
          <Route element = {<Register/>} path='/'/>
          <Route element = {<Login/>} path='/login'/>
      </Routes>
    </Router>
  )
}

export default App
