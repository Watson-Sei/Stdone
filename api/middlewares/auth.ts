import express from 'express';
const jwt = require('../utils/jwt');
const createError = require('http-errors');

const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.headers.authorization) {
        return next(createError.Unauthorized('Access token is required'))
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return next(createError.Unauthorized())
    }
    await jwt.verifyAccessToken(token).then((user: any) => {
        req.user = user
        next()
    }).catch((err: any) => {
        next(createError.Unauthorized(err.message))
    })
}

module.exports = auth;