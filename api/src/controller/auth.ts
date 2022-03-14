import express from 'express';
import * as User from '../services/user';
import { bufferToHex } from 'ethereumjs-util';
import { recoverPersonalSignature } from 'eth-sig-util';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authorization = async (req: express.Request, res: express.Response) => {
    const { signature, publicAddress } = req.body;
    if (!signature || !publicAddress) {
        return res.status(400).send({error: 'Request should have signature and publicAddress'});
    }
    const user = await User.findPublicAddress(publicAddress);
    if (!user) {
        return res.status(401).send({error: `User with publicAddress ${publicAddress} is not found in database`});
    }

    const msg = `I am signing my one-time nonce: ${user.nonce}`;
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf-8'));
    const address = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
    });
    if (address.toLowerCase() !== publicAddress.toLowerCase()) {
        return res.status(401).send({
            error: 'Signature verification failed'
        });
    }
    await User.updateNonce(publicAddress);
    const accessToken = jwt.sign({
        payload: {
            id: user.id,
            publicAddress,
        },
    },
    String(process.env.SECRET_KEY),
    {
        algorithm: 'HS256',
        expiresIn: '5m'
    })
    return res.status(200).json({access_token: accessToken});
}

export const validityVerify = async (req: express.Request, res: express.Response) => {
    const { access_token } = req.body;
    console.log('accesstoken:', access_token)
    if (!access_token) {
        return res.status(400).json({message: 'access_token undefined'})
    }
    jwt.verify(access_token, String(process.env.SECRET_KEY), (err: any, decode: any) => {
        if (err) {
            return res.status(400).json({message: 'access_token is invalid'})
        } else {
            return res.status(200).json({message: 'access_token is valid'})
        }
    })
}