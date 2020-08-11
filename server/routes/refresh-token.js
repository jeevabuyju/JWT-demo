const express = require('express')
const router = express.Router()
const { verify } = require('jsonwebtoken')
const { dummyDB } = require('../src/dummyDB')
const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken, 
} = require('../src/tokens')

router.post('/', async (req, res) => {
    const token = req.cookies.refreshToken
    
    // 1. If we don't have a token i our request
    if (!token) return res.send({ accessToken : '' });

    // 2. If we hav a token, verify it
    let payload = null
    try {
        payload = verify (token, process.env.REFRESH_TOKEN_SECRET)
        
    } catch (err) {
        return res.send({ accessToken : '' });
    }

    // 3. If token is valid, check user exist
    const user = dummyDB.find(user => user.id === payload.userId)
    if (!user) return res.send({ accessToken : '' });
    
    // 4. If user exist, check if refreshToken exist
    if (user.refreshToken !== token) return res.send({ accessToken : '' });

    // 5. If token exist, create new refresh and access Token
    const accessToken = createAccessToken(user.id)
    const refreshToken = createRefreshToken(user.id)
    user.refreshToken = refreshToken

    // 6. All good to GO, send new access and refresh Token
    sendRefreshToken(res, refreshToken)
    return res.send({ accessToken });
});

module.exports = router