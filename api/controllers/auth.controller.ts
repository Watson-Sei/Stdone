import express from 'express';
import axios from 'axios';
import qs from 'qs';
require('dotenv').config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const auth = require('../services/auth.service');
const createError = require('http-errors')

const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;

const youtubeClientId = process.env.YOUTUBE_CLIENT_ID;
const youtubeClientSecret = process.env.YOUTUBE_CLIENT_SECRET;

const twitchredirectUri = "http://localhost:3000/signin?id=twitch"
const youtuberedirectUri = "http://localhost:3000/signin?id=youtube"

class AuthController {
    // static twitch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //     console.log(twitchClientId)
    //     res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${twitchClientId}&redirect_uri=${twitchredirectUri}&response_type=code&scope=user:read:email`)
    // }
    static twitchCallback = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let token: string = '';
        let userInfo: any = null;
        const body: {
            client_id: string | undefined;
            client_secret: string | undefined;
            code: string | qs.ParsedQs | string[] | qs.ParsedQs[] | undefined;
            grant_type: string;
            redirect_uri: string;
        } = {
            client_id: twitchClientId,
            client_secret: twitchClientSecret,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: twitchredirectUri
        }
        await axios.post(`https://id.twitch.tv/oauth2/token`, qs.stringify(body), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => response.data['access_token'])
            .then(_token => {
                token = _token;
            }).catch(err => res.status(500).json({ message: err.message }))
        await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': String(twitchClientId)
            }
        })
            .then(response => response.data)
            .then(data => {
                userInfo = data.data[0];
            })
            .catch(err => res.status(500).json({ message: err.message }))
        // メールアドレスuniqueなアカウントが弊DBに既にあるか？
        const isAccount = await prisma.user.findUnique({
            where: {
                email: userInfo.email
            }
        })
        // アカウントが未作成の場合
        if (!isAccount) {
            try {
                const accessToken = await auth.registerTwitch(userInfo);
                return res.status(200).json({
                    status: true,
                    message: 'Access Token generation successded.',
                    accessToken: accessToken
                });
            } catch (e: any) {
                next(createError(e.statusCode, e.message))
            }
        } else {
            const isTwitchLink = await prisma.user.findFirst({
                where: {
                    AND: [
                        {
                            email: userInfo.email,
                        },
                        {
                            twitch_id: String(userInfo.id)
                        }
                    ]
                }
            })
            // アカウントは存在するがTwitchが未リンクの場合
            if (!isTwitchLink) {
                try {
                    const accessToken = await auth.linkTwitch(userInfo);
                    return res.status(200).json({
                        status: true,
                        message: 'Access Token generation successded.',
                        accessToken: accessToken
                    });
                } catch (e: any) {
                    next(createError(e.statusCode, e.message))
                }
            // アカウントとTwitchのリンクが確認できる場合
            } else {
                try {
                    const accessToken = await auth.loginTwitch(userInfo);
                    return res.status(200).json({
                        status: true,
                        message: 'Access Token generation successded.',
                        accessToken: accessToken
                    });
                } catch (e: any) {
                    next(createError(e.statusCode, e.message))
                }
            }
        }
    }
    // static youtube = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //     console.log(youtubeClientId);
    //     res.redirect(`https://accounts.google.com/o/oauth2/auth?client_id=${youtubeClientId}&redirect_uri=${youtuberedirectUri}&response_type=code&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`);
    // }
    static youtubeCallback = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let token: string = '';
        let userInfo: any = null;
        const body: {
            client_id: string | undefined;
            client_secret: string | undefined;
            code: string | qs.ParsedQs | string[] | qs.ParsedQs[] | undefined;
            grant_type: string;
            redirect_uri: string;
        } = {
            client_id: youtubeClientId,
            client_secret: youtubeClientSecret,
            code: req.query.code,
            grant_type: "authorization_code",
            redirect_uri: youtuberedirectUri
        };
        await axios.post('https://accounts.google.com/o/oauth2/token', qs.stringify(body), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => response.data['access_token'])
            .then(_token => {
                token = _token
            })
            .catch(err => res.status(500).json({ message: err.message }))
        await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.data)
            .then(data => {
                userInfo = data;
            })
            .catch(err => res.status(500).json({ message: err.message }))
        // メールアドレスuniqueなアカウントが弊DBに既にあるか？
        console.log(userInfo)
        const isAccount = await prisma.user.findUnique({
            where: {
                email: userInfo.email
            }
        })
        // アカウントが未作成の場合
        if (!isAccount) {
            try {
                const accessToken = await auth.registerYoutube(userInfo);
                return res.status(200).json({
                    status: true,
                    message: 'Access Token generation successded.',
                    accessToken: accessToken
                });
            } catch (e: any) {
                next(createError(e.statusCode, e.message))
            }
        } else {
            const isYoutubeLink = await prisma.user.findFirst({
                where: {
                    AND: [
                        {
                            email: userInfo.email,
                        },
                        {
                            youtube_id: String(userInfo.id)
                        }
                    ]
                }
            })
            // アカウントは存在するがYoutubeが未リンクの場合
            if (!isYoutubeLink) {
                try {
                    const accessToken = await auth.linkYoutube(userInfo);
                    return res.status(200).json({
                        status: true,
                        message: 'Access Token generation successded.',
                        accessToken: accessToken
                    });
                } catch (e: any) {
                    next(createError(e.statusCode, e.message))
                }
            // アカウントとTwitchのリンクが確認できる場合
            } else {
                try {
                    const accessToken = await auth.loginYoutube(userInfo);
                    return res.status(200).json({
                        status: true,
                        message: 'Access Token generation successded.',
                        accessToken: accessToken
                    });
                } catch (e: any) {
                    next(createError(e.statusCode, e.message))
                }
            }
        }
    }
    static me = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const user = await auth.me(req.user)
            return res.status(200).json({
                status: true,
                user
            })
        } catch (e: any) {
            return next(createError(e.statusCode, e.message));
        }
    }
}

module.exports = AuthController;