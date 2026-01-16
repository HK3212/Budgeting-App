const mongoose = require("mongoose")
const supertest = require("supertest")
const { MongoMemoryServer } = require("mongodb-memory-server")
const BudgetItem = require("../models/budgetItem")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

let api
let mongoServer
let token = null
let userId = null

// Mock secret if not in env (though app might require it to be set in .env)
const SECRET = process.env.SECRET || 'testsecret'

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    process.env.TEST_MONGODB_URI = mongoServer.getUri()
    const app = require("../app")
    api = supertest(app)
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
})

beforeEach(async () => {
    await BudgetItem.deleteMany({})
    await User.deleteMany({})

    // Create a test user
    const user = new User({
        username: "testuser",
        name: "Test User",
        passwordHash: "hashedpassword"
    })
    const savedUser = await user.save()
    userId = savedUser._id

    // Create token for the user
    const userForToken = {
        username: savedUser.username,
        id: savedUser._id,
    }

    // We need to ensure we use the same secret as the app uses for verification
    // In a real scenario, we'd ensure process.env.SECRET is set correctly
    token = jwt.sign(userForToken, process.env.SECRET || 'testsecret')
}, 10000) // Increase timeout for database operations

test("a valid budget item can be added", async () => {
    const newBudgetItem = {
        type: "Food",
        description: "Grocery shopping",
        isIncome: false,
        value: 50.00
    }

    await api
        .post("/api/budget")
        .set('Authorization', `bearer ${token}`)
        .send(newBudgetItem)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/budget").set('Authorization', `bearer ${token}`)
    const contents = response.body

    expect(contents).toHaveLength(1)
    expect(contents[0].description).toContain("Grocery shopping")
    expect(contents[0].value).toBe(50)
})

