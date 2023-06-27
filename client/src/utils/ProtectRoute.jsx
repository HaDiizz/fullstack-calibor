import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectRoute = () => {
    const { auth } = useSelector(state => state)
  return (
    auth.token ? <Outlet/> : <Navigate to={'/login'}/>
  )
}

export default ProtectRoute