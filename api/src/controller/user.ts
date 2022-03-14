import express from 'express';
import * as User from '../services/user';

export const find = async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.findPublicAddress(String(req.query.publicAddress));
        if (!user) {
            return res.status(200).json({users: []});
        }
        return res.status(200).json({users: [{publicAddress: user.publicAddress, nonce: user.nonce, username: user.username, email: user.email}]});
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

export const updateProfile = async (req: express.Request, res: express.Response) => {
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).send("Missing'username' or'email'")
    }
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(email)) {
        return res.status(400).send("Email address format is incorrect")
    }
    try {
        if (await User.updateProfile(req.decode.payload.publicAddress, username, email) === null) {
            return res.status(404).send('The user name already in use')
        } 
        return res.status(200).send(await User.updateProfile(req.decode.payload.publicAddress, username, email));
    } catch (error: any) {
        return res.status(404).send();
    }
}