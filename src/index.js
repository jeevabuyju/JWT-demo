const config = require('dotenv/config')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { verify } = require('jsonwebtoken')
const { hash, compare } = require('bcryptjs')
const { dummyDB } = require('./dummyDB')
const {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken, 
} = require('./tokens')

const PORT = process.env.PORT || 3000

// 1. Register a user
// 2. Login a user
// 3. Logout a user
// 4. Setup a protected route
// 5. Get a new accesstoken with a refresh token

const server = express()

// Use express middleware fro easy cookie handeling
server.use(cookieParser())

server.use(
    cors({
        orgin : 'http://localhost:3000',
        credentials : true,
    })
);

// Needed to read body data
server.use(express.json()) //to support JSON encoded bodies
server.use(express.urlencoded({ extended : true })) //to support URL encoded bodies


// 1. Resgister a user
server.post('/register', async (req,res) => {
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
})


// 2. Login a user
server.post('/login', async (req, res) => {
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
});



server.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
 });
 