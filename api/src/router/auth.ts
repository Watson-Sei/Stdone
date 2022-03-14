import express from 'express';
import * as Auth from '../controller/auth';

const router: express.Router = express.Router();

router.post('/authorization', Auth.authorization);
router.post('/valid', Auth.validityVerify);

export default router;