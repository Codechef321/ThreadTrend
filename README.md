# E-Commerce Website with Stripe Payment Integration
This project is a full-stack e-commerce website with Stripe payment integration. It allows users to browse products, add them to their cart, and securely checkout using the Stripe payment gateway.

# Features
Product Catalog: Display a list of products with details such as name, price, and description. 
Shopping Cart: Allow users to add and remove items from their cart. 
Checkout Process: Securely process payments using the Stripe payment gateway. 
User Authentication: Allow users to sign up, log in, and manage their account. 

# Technologies Used
Frontend: React, CSS, Bootstrap
Backend: Node.js, Express
Database: PostgreSQL
Payment Integration: Stripe
Security: bcrypt for password hashing, JWT for generating tokens during signup

# Installation
Clone the repository: git clone https://github.com/your-username/e-commerce-project.git
Install dependencies: npm install
Set up environment variables:
Create a .env file in the root directory.
Add the following variables:
makefile
Copy code
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_NAME=your_database_name
STRIPE_SECRET_KEY=your_stripe_secret_key
Run the application: npm start
Usage
Visit the website and browse the product catalog.
Add items to your cart and proceed to checkout.
Enter your payment details and complete the purchase.
View your order history and manage your account.
