import React, { useEffect, useState } from 'react'
import './Popular.css'
import  {Item}  from '../Item/Item';

export const Popular = () => {
  const [popular_product,setPopular_Product] = useState([]);
  useEffect(()=>{
    fetch('http://localhost:4000/popularinwomen')
    .then(res=>res.json())
    .then(parseData=>setPopular_Product(parseData))
  },[])

  return (
    <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <div className="popular-item">
            {popular_product.map((item,i)=>{
                return <Item key={i} id={item.id}
                name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            })}
        </div>
    </div>
  )
}
