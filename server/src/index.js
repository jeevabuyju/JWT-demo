const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

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
        origin : 'http://localhost:3000',
        credentials : true,
    })
);

// Needed to read body data
server.use(express.json()) //to support JSON encoded bodies
server.use(express.urlencoded({ extended : true })) //to support URL encoded bodies


// 1. Resgister a user
server.use('/register', require('../routes/register'));

// 2. Login a user
server.use('/login', require('../routes/login'));

// 3. Logout a user
server.use('/logout', require('../routes/logout'));

// 4. Setup a protected route
server.use('/protected', require('../routes/protected'));

// 5. Get a new accesstoken with a refresh token
server.use('/refresh_token', require('../routes/refresh-token'));


server.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
 });
 