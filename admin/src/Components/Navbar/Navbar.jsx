/* eslint-disable no-unused-vars */
import React from 'react'
import './Navbar.css';
import navlogo from '../../Assets/nav-logo.svg'
import navProfile from '../../Assets/nav-profile.svg'

export const Navbar = () => {
  return (
    <div className='navbar'>
      <img className='nav-logo' src={navlogo} alt="" />
      <img className='nav-profile' src={navProfile} alt="" />
    </div>
  )
}
