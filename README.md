# Flipkart Clone E-Commerce Platform

A complete, high-fidelity Flipkart Clone E-Commerce Platform engineered using the **MERN-like SQL stack**: **React.js** for a responsive UI canvas, **Express.js / Node.js** for the API gateway services, and **MySQL** as the primary relational database. 

This platform features a custom-built, dual-mode database manager that connects to a live MySQL instance and automatically falls back to an offline Javascript-powered JSON-flatfile query engine (`mock_db.json`) if the SQL connection is not yet configured or is offline. This ensures **zero-friction local review and testing** directly out of the box.

---

## 🌟 Visual & Practical Features

### 1. Catalog & Searching
- **Signature Flipkart Navbar**: Features a branded Explore Plus header, badged shopping cart & wishlist alerts, hover account panels, and a real-time auto-suggest query lookup box.
- **Top Categories Menu**: Quick-filter items dynamically by Mobiles, Electronics, Fashion, Furniture, Appliances, or Groceries.
- **Hero Carousel Banner**: Autoplaying promotional slide gallery showcasing curated product announcements.
- **Responsive Products Grid**: Styled with star pills, discount aggregates, f-Assured quality stamps, and subtle hover lifts.

### 2. Product Detail Exploration
- **Double Column layout**: Features vertical click-gallery thumbnail carousels on the left and scrolling specs descriptors on the right.
- **Dual CTA Buttons**: High-fidelity orange **"ADD TO CART"** (directs to the Cart sheet) and yellow **"BUY NOW"** (adds to cart and routes users directly to the Checkout desk).
- **Relational Specifications Grid**: Dynamically lists product parameters inside a clean alternate-row specifications panel.

### 3. Shopping Cart & Checkout Flow
- **Quantities Adjuster**: Synchronized increments (`+`) and decrements (`-`) that automatically enforce storage stock availability limits.
- **Price Details card**: Detailed pricing aggregates (MRP sums, discount savings deductions, free shipping notices).
- **Accordion Panel Checkout**: Structured accordion steps matching Flipkart's layout (User verify -> Address form -> Summary checklists -> Payment selections).
- **Secure payment Simulation**: Mock credit card inputs that trigger a realistic bank processing loader before placing transactions.

### 4. Transactions & History
- **Invoice Success Landing page**: Interactive success ticket showcasing generated Order Reference IDs, date timestamps, and items.
- **My Wishlist panel**: Beautiful catalog grid displaying liked items, enabling instant removal or cart transfers.
- **My Order History sheet**: Interactive past order lists that expand to reveal item summaries, item counts, prices paid, and shipping destinations.

---

## 🛠️ Technology Stack Used

- **Frontend Core**: React.js (built on Vite), React Router Dom, Axios, Lucide React (vector icons)
- **Styling Architecture**: Tailwind CSS, PostCSS, Autoprefixer, Google Webfonts
- **Backend API Gateway**: Node.js, Express.js, Cors, Dotenv
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Notification Services**: Nodemailer (SMTP dispatch with console fallback)
- **Primary Database**: MySQL (via `mysql2`)
- **Offline DB Fallback**: Node-JS flatfile engine parsing relational schemas in JSON format

---

## 🚀 Step-by-Step Setup Guide

### 📦 Prerequisites
- **Node.js** (v16.0 or higher recommended)
- **npm** (v8.0 or higher)
- **MySQL Server** (Optional – if MySQL is absent, the system automatically boots in JSON Offline Mode so you can inspect features immediately without database configurations).

---

### 🗄️ Step 1: Database Setup (MySQL Mode)

If you have a running MySQL server, initialize our relational schema:

1. Open your MySQL command CLI or management dashboard (such as phpMyAdmin or Workbench).
2. Execute the schema query located under `backend/db/schema.sql`:
   ```bash
   mysql -u root -p < backend/db/schema.sql
   ```
3. Set your custom DB port and credentials inside the backend `.env` file (see Step 2).

---

### ⚙️ Step 2: Environment Configurations

1. Navigate to the `/backend` folder.
2. Duplicate `.env.example` and rename the copy to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your parameters:
   ```env
   PORT=5000
   NODE_ENV=development

   # MySQL settings
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=flipkart_clone
   DB_PORT=3306

   # JWT secret
   JWT_SECRET=flipkart_secret_key_12345
   JWT_EXPIRE=24h

   # Optional SMTP (leave blank to log emails directly to console)
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USER=
   SMTP_PASS=
   ```

---

### 🏃 Step 3: Run Backend Server

1. Open a terminal in the `/backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (MySQL Mode Only) Run the seeding script to populate categories and catalog products:
   ```bash
   npm run db:seed
   ```
   *(Note: In JSON offline mode, seeding is performed automatically on startup).*
4. Launch the API Gateway:
   ```bash
   npm run dev
   ```
   The backend Gateway will start at `http://localhost:5000`.

---

### 💻 Step 4: Run Frontend Client

1. Open a new terminal in the `/frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

---

## 🔑 Demo Account Credentials

Use this pre-seeded account to log in and inspect the secure checkout flow:
- **Email Address**: `demo@flipkart.com`
- **Password**: `demo12345`

*(You can also sign up a new custom user directly through the Auth Portal).*

---

## 📡 API Routing Index

### Authentication (`/api/auth`)
- `POST /register` - Registers a new profile.
- `POST /login` - Log in existing user.
- `GET /me` - Get profile of current JWT bearer (Private).

### Products Catalog (`/api/products`)
- `GET /` - Fetch all products (optional filters: `category`, `search`, `limit`).
- `GET /categories/list` - Fetch all horizontal navigation categories.
- `GET /search?query=` - Custom text lookup.
- `GET /category/:categoryName` - Filter products by category name.
- `GET /:id` - Fetch item details with Specification JSONs and carousel images.

### Cart Management (`/api/cart` - Private)
- `GET /` - List active cart items.
- `POST /` - Add items or increment existing quantities.
- `PUT /:cartItemId` - Modify quantity parameters (+ / -).
- `DELETE /:cartItemId` - Remove item from cart.

### Wishlist (`/api/wishlist` - Private)
- `GET /` - List liked items.
- `POST /` - Save item.
- `DELETE /:productId` - Unlike item.

### Order Transactions (`/api/orders` - Private)
- `POST /` - Place a transaction order. Flushes cart, updates database inventory, and logs invoice notifications.
- `GET /` - List user transaction logs (Order History).
- `GET /details/:orderId` - Load order details (Address metadata, historical items purchased).

---

## 📐 Assumptions & Implementation Details

1. **Dual-Mode DB Interceptor**: If `mysql2` throws a connection refusal error, the system prints a detailed terminal notice and shifts state to read/write from `backend/db/mock_db.json`. All backend routes and SQL statements are mapped to equivalent JSON operations so the interface is identical.
2. **Email Notifications**: Includes standard `nodemailer` templates. If SMTP details are empty, it prints a stylized CLI Invoice block containing the exact layout to the backend console.
3. **Session State Cache**: JWT tokens are cached under `localStorage.token`. When refreshed, an API call restores user details.
