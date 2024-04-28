import React, { useEffect, useState } from 'react'
import "./NewCollection.css"
import { Item } from '../Item/Item'

export const NewCollection = () => {
  const [new_collection,setNew_Collection] = useState([]);
  useEffect(()=>{
    fetch("http://localhost:4000/newcollection")
    .then(res=>res.json())
    .then(data=>{
      setNew_Collection(data)
    })
  },[])

  return (
    <div className='new-collection'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="collections">
            {new_collection.map((item,i)=>{
              return <Item key={i} id={item.id}
              name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}
