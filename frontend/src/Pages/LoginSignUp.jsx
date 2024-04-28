import React, { useState } from 'react'
import './CSS/LoginSignUp.css'

export const LoginSignUp = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:""
  })
  const login = async() =>{
    console.log("login",formData);
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:"POST",
      headers:{
        Accept:'application/formData',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData)
    }).then(res=>res.json()).then(data=>{
      responseData = data;})
      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.message);
      }
  }
  const signup = async() =>{
    console.log("signup",formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:"POST",
      headers:{
        Accept:'application/formData',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData)
    }).then(res=>res.json()).then(data=>{
      responseData = data})
      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.message);
      }
  }

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  return (
    <div className='loginSignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up" && <input name='name' value={formData.name} onChange={changeHandler} type="text" placeholder='Your Name' autoComplete="name" />}
          <input name='email' value={formData.email} onChange={changeHandler} type="text" placeholder='Email Address' autoComplete='email'/>
          <input name='password' value={formData.password} onChange={changeHandler} type="Password" placeholder='Password' />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}} className='submit'>Submit</button>
        {state==="Sign Up" ? <p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p> :
        <p className='loginsignup-login'>Create an account ? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>}
        <div className="loginsignup-agree">
          <input type="checkbox" name='policy-check' />
          <p>By continuing, I agree to the terms of use $ privacy policy. </p>
        </div>
      </div>
    </div>
  )
}
