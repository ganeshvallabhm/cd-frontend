# CK Homemade Foods - Backend API

Production-ready Node.js + Express backend for food ordering system.

## Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure MongoDB Atlas**:
   - Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Get connection string
   - Update `.env` file with your connection string

3. **Update .env**:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ck-foods
   NODE_ENV=development
   ```

4. **Run the server**:
   ```bash
   npm run dev
   ```

5. **Verify**:
   - Open http://localhost:5000
   - Should see: `{"message": "CK Homemade Foods API is running", ...}`

## Project Structure

```
backend/
├─ src/
│   ├─ app.js              # Express app setup
│   ├─ server.js           # Server entry point
│   └─ config/
│       └─ db.js           # MongoDB connection
├─ .env                    # Environment variables (DO NOT COMMIT)
├─ .gitignore              # Git ignore rules
└─ package.json            # Dependencies
```

## Available Scripts

- `npm start` - Production mode
- `npm run dev` - Development mode (auto-restart)

## Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - Cross-origin requests

## Current Features

✅ Health check endpoint  
✅ MongoDB connection  
✅ CORS enabled  
✅ Error handling  
✅ Environment configuration  

## What's NOT Included (Yet)

- Authentication/OTP
- Payment integration
- Business logic
- API routes

## Next Steps

When ready to extend:
1. Create models (Menu, Order, User)
2. Add API routes
3. Implement authentication
4. Integrate payments

---

**Status:** ✅ Foundation Ready
