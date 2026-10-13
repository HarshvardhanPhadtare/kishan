# KisanBazaar 🌾

India's farmer marketplace with Pesticide Finder + Razorpay Payment Gateway.

## Project Structure

```
farmer-project/
├── frontend/          # Vanilla HTML/CSS/JS single-page application
│   ├── public/        # Static assets (images, video)
│   └── index.html     # SPA entry point (HTML + CSS + JS)
│
├── backend/           # Node.js / Express REST API
│   ├── src/
│   │   ├── config/        # DB and Cloudinary configuration
│   │   ├── controllers/   # HTTP request/response handlers
│   │   ├── middleware/     # JWT auth guards
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Endpoint definitions
│   │   ├── utils/         # Token, geo, upload helpers
│   │   ├── app.js         # Express app (middleware + routes)
│   │   └── server.js      # Entry point (DB connect + listen)
│   ├── uploads/           # Disk-stored pesticide images
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your secrets in .env
npm install
npm start          # production
npm run dev        # development (nodemon)
```

### Frontend

No build step required — the backend serves the frontend as static files.

npx serve . -p 4000

Open [http://localhost:4000](http://localhost:4000) after starting the backend.

## Features

- 🌾 Crop marketplace (farmer → buyer)
- 🧪 Pesticide finder with map (OpenStreetMap / Leaflet)
- 💳 Razorpay payment gateway
- 💵 Cash on Delivery option
- 🇮🇳 Marathi / English language toggle
- 👥 Three roles: Farmer, Buyer, Shop Owner
- 🤖 KisanBazaar AI Assistant (Gemini)

## Environment Variables

See `backend/.env.example` for the full list.

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default: 5000) |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GEMINI_API_KEY` | Google Gemini API key |

## Payment Setup

- Use TEST keys from [Razorpay dashboard](https://dashboard.razorpay.com) while developing (`rzp_test_...`)
- Switch to LIVE keys when deploying to production

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/products` | — | List products (filters: category, search, sort, farmer) |
| GET | `/api/products/:id` | — | Single product |
| POST | `/api/products` | farmer | Create listing |
| PUT | `/api/products/:id` | farmer | Update listing |
| DELETE | `/api/products/:id` | farmer | Delete listing |
| POST | `/api/orders` | buyer | Place order |
| GET | `/api/orders/my` | any | My orders |
| GET | `/api/orders/farmer` | farmer | Orders for my products |
| PUT | `/api/orders/:id/status` | any | Update order status |
| GET | `/api/pesticides` | — | List pesticides (geo, filter, sort) |
| GET | `/api/pesticides/shops` | — | Aggregated shop list |
| POST | `/api/pesticides` | shopowner | Add pesticide listing |
| DELETE | `/api/pesticides/:id` | shopowner | Remove listing |
| POST | `/api/payments/create-order` | any | Create Razorpay order |
| POST | `/api/payments/verify` | any | Verify payment signature |
| POST | `/api/payments/cod` | any | Mark as Cash on Delivery |
| POST | `/api/chatbot` | — | AI assistant (Gemini) |
| GET | `/api/health` | — | Health check |
