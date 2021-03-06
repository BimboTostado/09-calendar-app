import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginScreen } from '../components/auth/LoginScreen'
import { CalendarScreen } from '../components/calendar/CalendarScreen'

export const AppRouter = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route exact path='/login' element={ <LoginScreen /> }/>
                <Route exact path='/' element={ <CalendarScreen /> }/>
                <Route path='/*' element={ <Navigate to="/" /> }/>
            </Routes>
        </BrowserRouter>
    </div>
  )
}
