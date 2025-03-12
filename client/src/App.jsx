import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Register from './Auth/Register';
import Login from './Auth/Login';
import PrivateRoutes from './Auth/PrivetRoutes';
import Reservation from './pages/Reservation';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes/>}>
          <Route element = {<Reservation/>} path='/reservation'/>
        </Route>
          <Route element = {<Register/>} path='/'/>
          <Route element = {<Login/>} path='/login'/>
      </Routes>
    </Router>
  )
}

export default App
