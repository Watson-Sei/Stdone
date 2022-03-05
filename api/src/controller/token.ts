import express from 'express';
import fs from 'fs';
import path from 'path';

export const List = async (req: express.Request, res: express.Response) => {
    try {
        const jsonObject = JSON.parse(fs.readFileSync(`${path.resolve(__dirname, '../utils/token_list.json')}`, 'utf8'));
        return res.status(200).send(jsonObject);
    } catch (error: any) {
        res.status(404).send(error.message);
    }
}