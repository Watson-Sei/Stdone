import express from 'express';
import createError from 'http-errors';
import { List } from '../controller/token';

const router: express.Router = express.Router();

router.get('/list', List)

export default router;
