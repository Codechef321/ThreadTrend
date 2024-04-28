import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import nav_dropdown from '../Assets/nav_dropdown.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'

export const Navbar = () => {
    const [menu,setMenu] = useState('shop');
    const {getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle = (e) => {
      menuRef.current.classList.toggle("nav-menu-visible") ;
      e.target.classList.toggle("open"); 
    }

  return (
    <div className='navbar'>
    <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
        <div className="nav-logo">
            <img src={logo} alt="" />
            <p>SHOPPER</p>
        </div>
        <div>
        <ul ref={menuRef} className="nav-menu">
            <li onClick={()=>{setMenu("shop")}}><Link to='/'>Shop</Link>{menu==="shop" && <hr/>}</li>
            <li onClick={()=>{setMenu("Men")}}><Link to='/mens'>Men</Link>{menu==="Men" && <hr/>}</li>
            <li onClick={()=>{setMenu("Women")}}><Link to='/womens'>Women</Link>{menu==="Women" && <hr/>}</li>
            <li onClick={()=>{setMenu("Kids")}}><Link to='/kids'>Kids</Link>{menu==="Kids" && <hr/>}</li>
        </ul>
        </div>
        <div className="nav-login-cart">
          {localStorage.getItem('auth-token') ? <button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace("/")}}>Logout</button> :
        <Link to='/login' ><button>Login</button></Link> }
        <Link to='/cart'><img src={cart_icon} alt="" /></Link>
        <div  className='nav-cart-count'>{getTotalCartItems()}</div>
        </div>
    </div>
  )
}
