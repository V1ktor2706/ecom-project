# SpringEcom - Full-Stack E-Commerce Application

A full-stack e-commerce web application built using React and Spring Boot, featuring secure JWT authentication, role-based access control (RBAC), product catalog management, and complete order processing backed by PostgreSQL.

# Tech Stack

* Frontend(Generated, because the focus of this project is not on the frontend): React, JavaScript, Axios, HTML5, CSS3, Vite
* Backend: Java, Spring Boot, Spring Security (JWT), Spring Data JPA, Hibernate, RESTful APIs
* Database and Tools: PostgreSQL, Lombok, Postman, Maven

# Features

* JWT Stateless Authentication
* Role-Based Access Control (RBAC)
* Product Catalog & Multi-Field Search
* Cart & Order Flow
* Global CORS Integration

# How to Run the Project

## Prerequisites

* Node.js and npm
* Java Development Kit (JDK 17 or higher)
* PostgreSQL installed and running locally
* Maven

## 1. Database Setup

1. Open PostgreSQL.
2. Create a new database:
3.Configure your database credentials in src/main/resources/application.properties.

2. Running the Backend (Spring Boot)
Open a terminal and navigate to your backend directory.

The backend server will start on http://localhost:8080.

4. Running the Frontend (React)
Open a second terminal window and navigate to your frontend directory:

In the Bash
cd frontend
Install the necessary dependencies.

Then:
npm install

Start the development server:
npm run dev
Open your browser using this url: http://localhost:5173.

# API Endpoints:
## Authentication
POST /register - Register a new customer or admin user account

POST /login - Authenticate credentials and return a signed JWT Bearer token

##Products (Public & Admin)
GET /api/products - Retrieve all available products (Public)

GET /api/product/{id} - Retrieve a specific product by ID (Public)

GET /api/products/search?keyword={text} - Filter products by name, description, brand, or category (Public)

POST /api/product - Create a new product (Admin only)

PUT /api/product/{id} - Update existing product details (Admin only)

DELETE /api/product/{id} - Remove a product from the catalog (Admin only)

##Orders (Authenticated & Admin)
POST /api/orders/place - Place an order with line items and decrement inventory (Authenticated)

GET /api/orders - View all customer orders and transaction summaries (Admin only)

##Testing
Backend REST endpoints and security rules are verified using Postman.
