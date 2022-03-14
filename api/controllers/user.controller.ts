import express from 'express';
import axios from 'axios';
import qs from 'qs';
const user = require('../services/user.service');
const createError = require('http-errors');

class UserController {
    static donateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const donateUser = await user.donateUser(req.params.username)
            if (!donateUser) {
                return res.status(204).json({});
            }
            return res.status(200).json({
                status: true,
                donateUser
            })
        } catch (e: any) {
            return next(createError(e.statusCode, e.message))
        }
    }
}

module.exports = UserController;