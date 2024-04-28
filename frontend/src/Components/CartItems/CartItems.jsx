import React, { memo, useContext} from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const  CartItems = () => {
    const {getTotalCartAmount, all_product,cartItems,removeFromCart,addToCart} = useContext(ShopContext);

    const checkout = ()=>{
        fetch('http://localhost:4000/checkout',{
            method:'POST',
            headers:{
                Accept : 'application/json',
                'auth-token' :` ${localStorage.getItem('auth-token')}`,
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({
                cartItems
            })
        }).then(res =>{ 
           if(res.ok) return res.json()
           else return res.json().then(json => Promise.reject(json))
        })
        .then(({url})=>{
            window.location = url
        }).catch(e =>{
            console.error(e.error)
        })
    }

    const renderCartItems = () => {
        return all_product.map((e) => {
        if(cartItems[e.id]>0){
            return <div key={e.id}>
                <div className="cartitems-format cartitems-format-main">
        <img src={e.image} alt="" className='carticon-product-icon'/>
        <p>{e.name}</p>
        <p>₹{e.new_price}</p>
        <button className='cartitems-quantity'>{cartItems[e.id]}</button>
        <p>₹{e.new_price*cartItems[e.id]}</p>
        <div className='cartitems-change-icon'>
            <div className='cartitems-remove-icon'onClick={()=>{removeFromCart(e.id)}}><RemoveCircleIcon/></div>
            <div className="cartitems-add-icon" onClick={()=>{addToCart(e.id)}}><AddCircleIcon/></div>
        </div>
    </div>
    <hr />
            </div>
        }
        return null;
    });
};
  return (
    <div className='cartitems'>
        <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove/Add</p>
        </div>
        <hr />
        {renderCartItems()}
        <div className="cartitems-down">
            <div className="cartitems-total">
                <h2>Cart Totals</h2>
                <div>
                    <div className="cartitems-total-item">
                        <p>Subtotal</p>
                        <p>₹{getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Shipping Free</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Total</p>
                        <p>₹{getTotalCartAmount()}</p>
                    </div>
                    <hr />
                </div>
                    <button onClick={checkout}>PROCEED TO CHECKOUT</button>
            </div>
            <div className="cartitems-promocode">
                <p>If you have a promo code ,Enter it here</p>
                <div className="cartitems-promobox">
                    <input type="text" placeholder="Promo Code" name='promocode-input'/>
                    <button>Apply Promo Code</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default memo(CartItems);
