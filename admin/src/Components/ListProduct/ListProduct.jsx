import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from "../../Assets/cross_icon.png";

const ListProduct = () => {
const [allproducts,setAllProducts] = useState([]);
const fetchInfo = async ()=>{
    await fetch('http://localhost:4000/allproduct')
    .then((response)=> response.json())
    .then((data) => setAllProducts(data));
}
useEffect(()=>{
    fetchInfo()},[])

    const remove_product = async (id) =>{
        await fetch('http://localhost:4000/removeproduct',{
            method: 'POST',
            headers:{
                Accept: 'application/json',
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ id : id })
        })
        await fetchInfo();
    }

  return (
    <div className='list-product'>
        <h1>ALL PRODUCTS </h1>
        <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old Price</p>
            <p>New price</p>
            <p>Category</p>
            <p>Remove</p>
        </div>
        <div className="listproduct-allproduct">
    <hr />
    {allproducts.map((product,index)=>{
       return <div key={index}><div className="listproduct-format-main listproduct-format" >
            <img className='listproduct-product-icon' src={product.image} alt="" />
                   <p>{product.name}</p>
                   <p>₹{product.old_price} </p> 
                   <p>₹{product.new_price}</p>
                   <p> {product.category} </p> 
                   <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" defaultValue={product.id}/>
        </div>
        <hr /></div>
    })}
        </div>
    </div>
  )
}

export default ListProduct