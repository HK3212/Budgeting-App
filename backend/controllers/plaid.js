const plaidRouter = require("express").Router()
const plaidClient = require("../utils/plaidClient")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = (request) => {
    const authorization = request.get("authorization")
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        return authorization.substring(7)
    }
    return null
}

plaidRouter.post("/create_link_token", async (request, response) => {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" })
    }

    const user = await User.findById(decodedToken.id)

    const configs = {
        user: {
            client_user_id: user.id,
        },
        client_name: "Budgeting App",
        products: ["auth", "transactions"],
        country_codes: ["US"],
        language: "en",
    }

    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(configs)
        response.json(createTokenResponse.data)
    } catch (error) {
        console.error("Plaid Link Token Error:", error)
        response.status(500).json({ error: error.message })
    }
})

plaidRouter.post("/set_access_token", async (request, response) => {
    const { public_token } = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" })
    }

    try {
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token: public_token,
        })

        const accessToken = exchangeResponse.data.access_token
        const itemId = exchangeResponse.data.item_id

        const user = await User.findById(decodedToken.id)
        user.plaidAccessToken = accessToken
        user.plaidItemId = itemId
        await user.save()

        response.json({ message: "Access token saved successfully" })
    } catch (error) {
        console.error("Plaid Token Exchange Error:", error)
        response.status(500).json({ error: error.message })
    }
})

plaidRouter.get("/balance", async (request, response) => {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" })
    }

    const user = await User.findById(decodedToken.id)
    if (!user.plaidAccessToken) {
        return response.status(400).json({ error: "Plaid not linked" })
    }

    try {
        const balanceResponse = await plaidClient.accountsBalanceGet({
            access_token: user.plaidAccessToken,
        })
        response.json(balanceResponse.data)
    } catch (error) {
        console.error("Plaid Balance Error:", error)
        response.status(500).json({ error: error.message })
    }
})

module.exports = plaidRouter
