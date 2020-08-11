const express = require('express')
const router = express.Router()

router.post('/', async (_req, res) => {
    res.clearCookie('refreshToken', { path : '/refresh_token' })
    res.send({
        message : 'Logged Out',
    })
});

module.exports = router