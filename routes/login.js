require("dotenv/config")
const express = require('express')
const router = express.Router()
const { compare } = require('bcryptjs')
const { dummyDB } = require('../src/dummyDB')
const {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken, 
} = require('../src/tokens')

router.post('/', async (req, res) => {
    const { email, password } = req.body

    try {
        // 1. Check if user exist,else throw error
        const user = dummyDB.find(user => user.email === email)
        if (!user) throw new Error('invalid username')

        // 2. Check password is correct, else throw error
        const valid = await compare(password,user.password);
        if (!valid) throw new Error('invalid password')

        // 3. Create access and refresh token
        const accessToken = createAccessToken(user.id)
        const refreshToken = createRefreshToken(user.id)

        // 4. Put RefreshToken in DB
        user.refreshToken = refreshToken
        console.log(dummyDB)

        // 5. Send refreshToken as cookie and accessToken as res
        sendRefreshToken(res, refreshToken)
        sendAccessToken(req, res, accessToken)

    } catch (err) {
        res.send({
            error : `${err.message}`,
        });
    }
})

module.exports = router