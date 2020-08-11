const { verify } = require('jsonwebtoken')

const isAuth = (req) => {
    const authorization = req.headers['authorization']
    if (!authorization) throw new Error('Please Login')
    const token = authorization.split(' ')[1]  // eg : 'Bearer ohon4789637dfhbg94y7tghergg948hgufhjg'
    const { userId } = verify (token, process.env.ACCESS_TOKEN_SECRET)
    return userId
}

module.exports = {
    isAuth
}