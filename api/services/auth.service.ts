import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

require('dotenv').config();
const jwt = require('../utils/jwt');

class AuthService {
    // Twitchからの新規作成の場合
    static async registerTwitch(payload: any) {
        const user = await prisma.user.create({
            data: {
                twitch_id: String(payload.id),
                youtube_id: null,
                email: payload.email,
                username: payload.login
            }
        })
        console.log('create twitch link user: ', user)
        const accessToken = jwt.signAccessToken(user);
        return accessToken;
    }
    static async linkTwitch(payload: any) {
        const user = await prisma.user.update({
            where: {
                email: payload.email,
            },
            data: {
                twitch_id: String(payload.id)
            }
        })
        console.log('update twitch link user: ', user)
        const accessToken = jwt.signAccessToken(user);
        return accessToken;
    }
    static async loginTwitch(payload: any) {
        const accessToken = await jwt.signAccessToken(payload);
        return accessToken;
    }
}

module.exports = AuthService;