const express = require('express')
const router = express.Router()
const { isAuth } = require('../src/isAuth')

router.post('/', async (req, res) => {
    try {
        const userId = isAuth(req)
        if (userId !== null){
            res.send({
                data : 'This is protected data',
            });
        }
        
    } catch (err) {
        res.send({
            error : `${err.message}`,
        });
    }
});

module.exports = router