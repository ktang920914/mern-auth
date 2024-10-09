import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Header from './compoenents/Header'
import PrivateRoute from './compoenents/PrivateRoute'

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>

        <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>}/>
        </Route>
        
        <Route path='/sign-up' element={<Signup/>}/>
        <Route path='/sign-in' element={<Signin/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App