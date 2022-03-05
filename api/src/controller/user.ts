import express from 'express';
import * as User from '../services/user';

export const find = async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.findPublicAddress(String(req.query.publicAddress));
        if (!user) {
            return res.status(200).json({users: []});
        }
        return res.status(200).json({users: [{publicAddress: user.publicAddress, nonce: user.nonce, username: user.username}]});
    } catch (error: any) {
        res.status(404).send(error.message);
    }
}

export const findUsername = async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.findUsername(String(req.query.username))
        if (!user) {
            return res.status(200).json({users: []});
        }
        return res.status(200).json({users: [{publicAddress: user.publicAddress, username: user.username, isContract: user.isContract}]})
    } catch (error: any) {
        res.status(404).send(error.message);
    }
}

export const create = async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.create(String(req.query.publicAddress))
        if (!user) {
            return res.status(200).json({users: []});
        }
        return res.status(200).json({users: [{publicAddress: user.publicAddress}]});
    } catch (error: any) {
        res.status(404).send(error.message);
    }
}

export const updateIsContract = async (req: express.Request, res: express.Response) => {
    try {
        if (req.query.publicAddress) {
            await User.updaetIsContract(String(req.query.publicAddress));
            return res.status(204)
        }
        return res.status(404)
    } catch (error: any) {
        res.status(404)
    }
}