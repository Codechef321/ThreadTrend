import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors"
import bcrypt from "bcrypt"
import stripe from "stripe";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 4000;
const stripeInstance = stripe(process.env.STRIPE_PRIVATE_KEY);
const db = new pg.Client({
  user:process.env.user,
  host: process.env.host,
  database:process.env.database,
  password: process.env.password,
  port:process.env.port,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images',express.static('upload/images'));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Express app is running")
});

//Image Storage Engine

const Storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
      ;
    return cb(null, file.fieldname + '_' + uniqueSuffix)
  },
})
const upload = multer({ storage:Storage });

//Creating upload endpoint for images
app.post("/upload",upload.single('product'), (req,res)=>{
  res.json({
    success :1,
    image_url : `${process.env.CLIENT_URL}/images/${req.file.filename}`
  })
})

app.post('/addproduct', async(req,res)=>{
  const result = await db.query("INSERT INTO product(name,old_price,new_price,category,image) VALUES($1,$2,$3,$4,$5) RETURNING *", [
    req.body.name,
    req.body.old_price,
    req.body.new_price,
    req.body.category,
    req.body.image]);
  res.json(result.rows);
})

app.post('/removeproduct',async(req,res)=>{
  const result = await db.query(`DELETE FROM product WHERE id=$1 RETURNING  *`,[req.body.id]);
  if(!result){
    throw new Error('Failed to delete product');
  }
  res.status(200).json({message:'Product deleted',data:result.rows[0]});
});

app.get('/allproduct', async (req,res) =>{
  let result = await db.query('SELECT * FROM product' );
  if(result.rowCount > 0 ) {
    res.send(result.rows);
  } else {
    res.status(404).json({ message: 'No products found' });
  }
});

// Creating Endpoint for new  user registration
app.post('/signup', async (req, res) => {
  let check = await db.query("SELECT FROM users WHERE email = $1",[req.body.email]);
  if(check.rowCount>0){
  return res.status(400).json( "Email is already in use");
  }
  let cart = {};
  for(let i = 0;i<50;i++){
    cart[i]=0;
  }
  const salt = await bcrypt.genSalt(process.env.saltRounds);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user =await db.query("INSERT INTO users (name,email,password,cartdata) VALUES($1,$2,$3,$4) RETURNING *",[req.body.name,req.body.email, hashedPassword,cart]);
  const data=user.rows[0].email;
  const token = jwt.sign({user : data},process.env.jwtSecretKey);
  res.json({success:true,token});
})

//Endpoint for user login
app.post('/login', async (req, res) => {
  try {
    let user = await db.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
    if (user.rowCount > 0) {
      const passComp =bcrypt.compare(req.body.password, user.rows[0].password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return; }
        if (result) {
          const data = user.rows[0].email;
          const token = jwt.sign(data, process.env.jwtSecretKey);
          res.json({ success: true, token });
        } else {
          res.json({ success: false, message: 'Incorrect password' });}
      });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//Creating endpoint for new collection
app.get('/newcollection', async (req, res) => {
  const products = await db.query("SELECT * FROM product ORDER BY id DESC");
  let newCollection = products.rows.slice(0,8);
  res.json(newCollection);
});

//creating endpoint for popular in women section
app.get('/popularinwomen', async(req,res)=> {
  let products = await db.query("SELECT * FROM product where category = $1",["women"]);
  let popularInWomen = products.rows.slice(0,4);
  res.json(popularInWomen);
})

//creating middleware for checking if user is logged in
const fetchUser = async (req,res,next) => {
  const token = req.header('auth-token');
  if(!token) {
    res.status(401).send({error: "Please authenticate using a valid token"})
  } else { 
    try{
      const data = jwt.verify(token, process.env.jwtSecretKey);
      req.user = data ;
      next();
    } catch(error) {
      res.status(401).send({error: "Please authenticate using a valid token"})
    }
}}

//creating endpoint for adding to cart
app.post('/addtocart',fetchUser, async (req, res) => {
  let userData = await db.query(`UPDATE users set cartdata = JSONB_SET(cartdata,'{${req.body.itemId}}',((cartdata ->> '${req.body.itemId}')::int + 1)::TEXT::JSONB)  WHERE email = $1`,[req.user]);
  res.send({success: true, message: "Product added to cart"});
  })

  //creating endpoint for removing from cart
app.post('/removefromcart',fetchUser, async (req, res) => {
  let result = await db.query(`SELECT (cartdata ->> '${req.body.itemId}')::int AS quantity FROM users WHERE email = $1`,[req.user]);
  if(result.rows[0].quantity>0){
   let userData = await db.query(`UPDATE users set cartdata = JSONB_SET(cartdata,'{${req.body.itemId}}',((cartdata ->> '${req.body.itemId}')::int - 1)::TEXT::JSONB)  WHERE email = $1`,[req.user]);
  res.send({success: true, message: "Product removed from cart"});
  } else {
    res.send({success: false, message: "Product not in cart"});
  }
  })

  //creating endpoint to get cartdata
  app.post('/getcart',fetchUser, async(req,res)=>{
    let userData = await db.query(`SELECT * FROM users WHERE email = $1`,[req.user]);
    res.json(userData.rows[0].cartdata);
  })

  //creating payment gateway
  app.post('/checkout', async (req, res) => {
    try{const { cartItems } = req.body;
    const lineItems = [];
  for (const [productId, quantity] of Object.entries(cartItems) ) {
    if(quantity>0){
    const productDetails = await db.query("SELECT * FROM product WHERE id =$1",[productId]);
    const productDetail = productDetails.rows[0];
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: productDetail.name
        },
        unit_amount: productDetail.new_price*100,
      },
      quantity: quantity,
    });
  }}
  // Create the Checkout session
  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: process.env.CLIENT_URL,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });
  // Return the Checkout session ID to the client
  res.json({ url: session.url });} catch(err){
    console.log(err);
  }
});

app.listen(port, (error) => {
  if(error) {
    throw error;
  } else {
  console.log("Server is running on " + process.env.SERVER_URL)}
});