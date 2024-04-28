import React from 'react'
import './Addproduct.css'
import upload_area from  "../../Assets/upload_area.svg"

export const Addproduct = () => {
    const [image, setImage] = React.useState(false);
    const [productDetails, setProductDetails] = React.useState({
        name:"", image: "", category: "Women", new_price: "", old_price: ""
})

    const imageHandler = (e) =>{
        URL.revokeObjectURL(image);
        setImage(e.target.files[0])
    }
    const changeHandler = e =>{
        setProductDetails({...productDetails,[e.target.name]: e.target.value })
    } //name is name of the target not name detail
    const Add_Product = async () => {
        let responseData ;
        let product = productDetails;

        let formData  = new FormData();
        formData.append('product',image);
        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body :formData,
        }).then((resp)=> resp.json().then((data)=>{responseData = data}))
        if(responseData.success){
            product.image=responseData.image_url;
            await fetch('http://localhost:4000/addproduct',{
                method: 'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                console.log(data.success);
                data?alert("Successfully added"): alert("Failed to add");
            })
        }
    }

  return (
    <div className='addproduct'>
        <div className="addproduct-itemfield">
            <p>Product Title</p>
            <input value={productDetails.name} onChange={changeHandler} type="text"  name="name" placeholder='Enter product title' />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className="addproduct-selector">
                <option value="womens">women</option>
                <option value="mens">men</option>
                <option value="kids">kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img className='addproduct-thumbnail-img' src={image?URL.createObjectURL(image):upload_area} alt="" />
            </label>
            <input onChange={imageHandler} id='file-input' type="file" name='image' hidden/>
        </div>
        <button onClick={Add_Product} className='addproduct-btn'>Submit</button>
    </div>
  )
}
