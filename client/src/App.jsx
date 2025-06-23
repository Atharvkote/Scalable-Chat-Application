import React, { useState, useEffect } from 'react'
import { useLocation, useSearchParams, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/home-page'
import Error from './pages/error-page'
import LandingPage from './pages/landing-page'
import LoginPage from './pages/login-page'
import SignUpPage from './pages/signup-page'
import ProfilePage from './pages/profile-page'
import UserSettingsPage from './pages/user-setting-page'
import { Loader2 } from 'lucide-react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import useAuth from './store/auth-context.js'
import { useTheme } from './store/theme-context.js'

const App = () => {

  {/* Hooks & Definations */ }
  const { authUser, checkAuth, isCheckingAuth } = useAuth();
  const pathname = useLocation().pathname;
  const NoNavbarRoutes = [""];
  const NoFooterRoutes = [""];
  const { theme } = useTheme();

  {/* Effect Initial  Configs*/ }
  useEffect(() => { checkAuth();  }, [checkAuth])
  

  {/* Loaders */ }
  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='animate-spin text-purple-400 text-9xl' />
      </div>
    )
  }

  return (
    <div data-theme={theme} className='min-h-screen flex flex-col'>
      {/* Conditionals Rendering for Navbar Based Routes*/}
      {!NoNavbarRoutes.includes(pathname) && <Navbar />}
      <Routes>

        {/* Public Rotues */}
        <Route exact path='/' element={<LandingPage />} />
        <Route exact path='/user/login' element={<LoginPage />} />
        <Route exact path='/user/signup' element={<SignUpPage />} />
        <Route exact path='/user/profile/settings' element={ <UserSettingsPage />} />

        {/* Auth Protected Routes */}
        <Route exact path='/chat' element={authUser ? <Home /> : <Navigate to='/user/login' />} />
        <Route exact path='/chat/:id' element={authUser ? <Home /> : <Navigate to='/user/login' />} />
        <Route exact path='/user/profile' element={authUser ? <ProfilePage /> : <Navigate to='/user/login' />} />

        {/* Error 404 Page */}
        <Route path='*' element={<Error />} />

      </Routes>
      {/* Conditionals Rendering for Footer Based Routes */}
      {!NoFooterRoutes.includes(pathname) && <Footer />}
    </div>
  )
}

export default App
