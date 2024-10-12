import React from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import SignIn from '../src/Components/SignIn'
import Login from './Components/Login'
import OTPVerification from './Components/OTPVerification'
import AuthLayout from './Components/AuthLayout'
import Dashboard from './Components/Dashboard'
function App() {

  return (
    <>
    <Routes>
      <Route element={<AuthLayout/>} path='/signin'></Route>
      <Route element={<AuthLayout/>} path='/login'></Route>
      <Route element={<AuthLayout/>} path='/verify-otp'></Route>
      <Route element={<Dashboard/> } path='/'></Route>
    </Routes>
        
    </>
  )
}

export default App
