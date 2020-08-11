const express = require('express')
const router = express.Router()
const { hash } = require('bcryptjs')
const { dummyDB } = require('../src/dummyDB')

router.post('/', async (req,res) => {
    const { email, password } = req.body;

    try{
        // 1. Check if user exist
        const user = dummyDB.find(user => user.email === email)
        if (user) throw new Error('User already exists')

        // 2. if user do not exist, hash password
        const hashedPassword = await hash(password, 10);

        // 3. insert user into DB
        dummyDB.push({
            id : dummyDB.length,
            email : email,
            password : hashedPassword
        });
        res.send({
            message : 'User Created'
        });

        console.log(dummyDB)

    }catch(err)
    {
        res.send({
            error : `${err.message}`,
        });
    }
});

module.exports = router