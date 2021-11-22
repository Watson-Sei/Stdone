import jwt from 'jsonwebtoken';
require('dotenv').config();
const accessTokenSecretKey: string | undefined = process.env.ACCESS_TOKEN_SECRET_KEY;
import CreateError from 'http-errors';

interface User {
    id: number;
    twitch_id: string | null;
    youtube_id: string | null;
    email: string;
    username: string;
}

module.exports = {
    signAccessToken(payload: User) {
        return new Promise((resolve, reject) => {
            jwt.sign({ payload }, String(accessTokenSecretKey), {}, (err, token) => {
                if (err) {
                    reject(CreateError.InternalServerError)
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, String(accessTokenSecretKey), (err, payload) => {
                if (err) {
                    return reject(CreateError.Unauthorized);
                }
                resolve(payload)
            })
        })
    }
}