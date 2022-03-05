import express from 'express';
import * as User from '../controller/user';

const router: express.Router = express.Router();

router.get('/findPublicAddress', User.find);
router.get('/findUsername', User.findUsername);
router.post('/create', User.create);
router.put('/updateIsContract', User.updateIsContract);

export default router;