import React from 'react'
import './NewsLetter.css'

export const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Get Exclusive Offers  and Updates!</h1>
        <p>Subscribe to our newsletter for the latest updates about our products</p>
        <div>
            <input name='subscribe' type="email" placeholder='Your email Id' />
            <button>SUBSCRIBE</button>
        </div>
    </div>
  )
}
