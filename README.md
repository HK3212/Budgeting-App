# Budgeting Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) budgeting application for tracking income, expenses, spending goals, and retirement planning with optional bank account integration via Plaid.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)

## Features

- 📊 Monthly budget tracking (income and expenses)
- 🎯 Category-based spending goals
- 📈 Interactive D3.js pie chart visualizations
- 🏦 Bank account integration via Plaid API (optional)
- 💰 Real-time net worth calculation
- 🔮 Retirement planning calculator with projections
- 🔐 Secure JWT authentication
- 🗑️ Automatic previous month data cleanup

## Table of Contents

- [Prerequisites](#prerequisites)
- [MongoDB Setup](#mongodb-setup)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [First-Time Usage](#first-time-usage)
- [Optional: Plaid Bank Integration](#optional-plaid-bank-integration)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Available Scripts](#available-scripts)

## Prerequisites

- **Node.js** v14.x or higher
- **MongoDB** v4.4 or higher
- **npm** v6.x or higher (or yarn)
- **(Optional)** Plaid API account for bank integration

## MongoDB Setup

<details>
<summary><b>macOS Installation</b></summary>

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify installation
mongosh
```

</details>

<details>
<summary><b>Windows Installation</b></summary>

1. Download MongoDB Community Server from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the MSI installer
3. Choose "Complete" installation
4. Install as a Windows Service
5. Start MongoDB:
   ```cmd
   net start MongoDB
   ```
6. Verify installation:
   ```cmd
   mongosh
   ```

</details>

<details>
<summary><b>Linux (Ubuntu/Debian) Installation</b></summary>

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongosh
```

</details>

**Database Structure:**
- Database: `budget-app` (development) / `budget-app-test` (testing)
- Collections: `users`, `budgetitems`, `goals` (auto-created on first run)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd Budgeting-App

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Environment Configuration

Create a `.env` file in the `/backend` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/budget-app
TEST_MONGODB_URI=mongodb://localhost:27017/budget-app-test

# Server Configuration
PORT=3001

# JWT Secret - Generate a secure random string
SECRET=your_jwt_secret_key_here

# Node Environment (leave empty for development)
NODE_ENV=

# Optional: Plaid API Configuration (only if using bank integration)
PLAID_ENV=sandbox
PLAID_CLIENT_ID=
PLAID_SECRET=
```

<details>
<summary><b>Environment Variables Explained</b></summary>

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string for development | Yes |
| `TEST_MONGODB_URI` | MongoDB connection string for testing | Yes |
| `PORT` | Backend server port (frontend proxies to this) | Yes |
| `SECRET` | JWT signing key for authentication | Yes |
| `NODE_ENV` | Environment mode (leave empty for dev, or set to `production`) | No |
| `PLAID_ENV` | Plaid environment (`sandbox`, `development`, or `production`) | No |
| `PLAID_CLIENT_ID` | Your Plaid client ID | No |
| `PLAID_SECRET` | Your Plaid secret key | No |

**Generate a secure SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

</details>

## Running the Application

### Development Mode (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend opens automatically at `http://localhost:3000`

### Production Mode

```bash
cd backend
npm run build:start
```
✅ Full app runs on `http://localhost:3001`

**What to expect:**
- Login/registration page on first visit
- Budget dashboard with pie chart after login
- Navigation: Budget (home), Goals, Accounts, Retirement Planning

## First-Time Usage

1. **Register** - Create an account (username min 4 characters)
2. **Login** - Enter credentials to receive authentication token
3. **Add Budget Items:**
   - Click "Add Income" or "Add Expense"
   - Select category, description, amount, and date
   - See pie chart update in real-time
4. **Set Spending Goals** - Navigate to Goals tab, set monthly limits per category
5. **View Summary** - Track income vs expenses and remaining budget

**Available Categories:**
- **Income:** Employment, Commerce, Dividends, Stocks, Tax Return
- **Expenses:** Groceries, Dining, Transportation, Housing, Utilities, Education, Entertainment, Clothing, Health, Debt, Investment, Insurance, Personal

## Optional: Plaid Bank Integration

**What it enables:**
- Link real bank accounts
- View account balances
- Calculate net worth automatically
- Consolidated financial dashboard

**Setup Steps:**

1. Create a free account at [plaid.com](https://plaid.com/)
2. Get API credentials from Plaid Dashboard
3. Add to `.env`:
   ```env
   PLAID_CLIENT_ID=your_client_id
   PLAID_SECRET=your_secret
   PLAID_ENV=sandbox
   ```
4. Restart backend server
5. In app: Navigate to "Accounts" → "Link Account"

**Note:** The app is fully functional without Plaid. This feature is entirely optional.

## Testing

```bash
# Backend tests (uses in-memory MongoDB)
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## API Documentation

<details>
<summary><b>Authentication Endpoints</b></summary>

### Register User
```bash
POST /api/users
Content-Type: application/json

{
  "username": "john_doe",
  "name": "John Doe",
  "password": "securepassword123"
}

# Response: 201 Created
{
  "username": "john_doe",
  "name": "John Doe",
  "id": "65f8a1b2c3d4e5f6g7h8i9j0"
}
```

### Login
```bash
POST /api/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}

# Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "name": "John Doe"
}
```

</details>

<details>
<summary><b>Budget Endpoints (Requires Authentication)</b></summary>

### Get Budget Items
```bash
GET /api/budget
Authorization: Bearer <token>

# Response: 200 OK
[
  {
    "id": "65f8a1b2c3d4e5f6g7h8i9j0",
    "isIncome": false,
    "type": "Groceries",
    "description": "Weekly shopping",
    "value": 125.50,
    "date": "2026-01-15"
  }
]
```

### Create Budget Item
```bash
POST /api/budget
Authorization: Bearer <token>
Content-Type: application/json

{
  "isIncome": true,
  "type": "Employment",
  "description": "Monthly salary",
  "value": 5000,
  "date": "2026-01-16"
}

# Response: 201 Created
```

### Update Budget Item
```bash
PUT /api/budget/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": 150
}

# Response: 200 OK
```

### Delete Budget Item
```bash
DELETE /api/budget/:id
Authorization: Bearer <token>

# Response: 204 No Content
```

</details>

<details>
<summary><b>Spending Goals Endpoints (Requires Authentication)</b></summary>

### Get Goals
```bash
GET /api/goals
Authorization: Bearer <token>

# Response: 200 OK
[
  {
    "id": "65f8a1b2c3d4e5f6g7h8i9j2",
    "category": "Groceries",
    "maxGoal": 500,
    "date": "2026-01"
  }
]
```

### Create Goal
```bash
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Dining",
  "maxGoal": 300
}

# Response: 201 Created
```

### Delete Goal
```bash
DELETE /api/goals/:id
Authorization: Bearer <token>

# Response: 204 No Content
```

</details>

<details>
<summary><b>Plaid Integration Endpoints (Requires Authentication & Plaid Config)</b></summary>

### Create Link Token
```bash
POST /api/plaid/create_link_token
Authorization: Bearer <token>

# Response: 200 OK
{
  "link_token": "link-sandbox-abc123..."
}
```

### Exchange Public Token
```bash
POST /api/plaid/set_access_token
Authorization: Bearer <token>
Content-Type: application/json

{
  "public_token": "public-sandbox-xyz789..."
}

# Response: 200 OK
{
  "access_token": "access-sandbox-...",
  "item_id": "item123..."
}
```

### Get Account Balances
```bash
GET /api/plaid/balance
Authorization: Bearer <token>

# Response: 200 OK
{
  "accounts": [
    {
      "account_id": "acc123",
      "name": "Checking Account",
      "balances": {
        "available": 2500.50,
        "current": 2650.75
      }
    }
  ]
}
```

</details>

## Project Structure

```
Budgeting-App/
├── backend/                    # Express.js backend
│   ├── controllers/            # Route handlers
│   │   ├── budget.js          # Budget CRUD operations
│   │   ├── goals.js           # Goals management
│   │   ├── login.js           # Authentication
│   │   ├── plaid.js           # Plaid API integration
│   │   └── users.js           # User management
│   ├── models/                # Mongoose schemas
│   │   ├── budgetItem.js      # Budget item model
│   │   ├── goal.js            # Spending goal model
│   │   └── user.js            # User model
│   ├── tests/                 # Jest tests
│   ├── utils/                 # Utilities & middleware
│   ├── .env                   # Environment variables
│   ├── app.js                 # Express app setup
│   └── index.js               # Server entry point
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Budget/        # Budget list display
│   │   │   ├── BudgetForm/    # Add/edit forms
│   │   │   ├── PieChart/      # D3.js visualization
│   │   │   ├── SpendingGoals/ # Goals management
│   │   │   ├── RetirementPlanner/
│   │   │   └── ...
│   │   ├── services/          # API clients
│   │   ├── App.js             # Main component
│   │   └── index.js           # React entry point
│   └── package.json
│
└── README.md
```

## Troubleshooting

<details>
<summary><b>MongoDB Connection Failed</b></summary>

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
- Ensure MongoDB is running:
  - macOS: `brew services list`
  - Linux: `sudo systemctl status mongod`
  - Windows: Check Services app
- Verify `MONGODB_URI` in `.env` is correct
- Test connection: `mongosh`

</details>

<details>
<summary><b>Port Already in Use</b></summary>

**Error:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solutions:**
- Change `PORT` in `.env` to another port (e.g., 3002)
- Kill the process using the port:
  ```bash
  # Find process
  lsof -ti:3001
  
  # Kill process
  lsof -ti:3001 | xargs kill
  ```

</details>

<details>
<summary><b>CORS Errors</b></summary>

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Ensure backend is running on `http://localhost:3001`
- Frontend must be on `http://localhost:3000`
- Check proxy configuration in `frontend/package.json`

</details>

<details>
<summary><b>JWT Token Invalid</b></summary>

**Error:** `JsonWebTokenError: invalid token`

**Solutions:**
- Clear browser localStorage and login again
- Ensure `SECRET` in `.env` hasn't changed
- Verify Authorization header format: `Bearer <token>`

</details>

<details>
<summary><b>Plaid Configuration Errors</b></summary>

**Error:** `PLAID_SECRET not found`

**Note:** Plaid is optional. If not using bank integration, you can safely ignore these errors.

**Solutions if using Plaid:**
- Verify all Plaid credentials are correct in `.env`
- Ensure no extra spaces in `.env` values
- Restart backend after changing `.env`

</details>

<details>
<summary><b>Module Not Found</b></summary>

**Error:** `Error: Cannot find module 'express'`

**Solutions:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

</details>

## Available Scripts

### Backend Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `nodemon index.js` | Start development server with auto-restart |
| `npm start` | `node index.js` | Start production server |
| `npm test` | `jest --verbose --runInBand` | Run tests with in-memory MongoDB |
| `npm run build:ui` | Build frontend → backend/build | Build and copy frontend |
| `npm run build:start` | Build + start backend | Full production build |

### Frontend Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `react-scripts start` | Start dev server on localhost:3000 |
| `npm run build` | `react-scripts build` | Build production bundle |
| `npm test` | `react-scripts test` | Run tests in watch mode |

---

## License

MIT License - See LICENSE file for details

---

**Questions or Issues?** Please open an issue on GitHub.
