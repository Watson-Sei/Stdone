import express from 'express';
import jwt from 'jsonwebtoken';

export const verify = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const header = req.headers.authorization;
    if (header !== undefined) {
        if (header.split(" ")[0] === "Bearer") {
            jwt.verify(header.split(" ")[1], String(process.env.SECRET_KEY), (err: any, decode: any) => {
                if (err) {
                    return res.status(401).send(err.message);
                } else {
                    req.decode = decode;
                    return next()
                }
            })
        } else {
            return res.status(401).send('Incorrect header information');
        }
    } else {
        return res.status(401).send('Incorrect header information');
    }
}