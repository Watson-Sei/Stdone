import express from 'express';
import user from './user';
import auth from './auth';
import token from './token';
import createError from 'http-errors';

const router: express.Router = express.Router();

router.use('/user', user);
router.use('/auth', auth);
router.use('/token', token);

router.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return next(createError(404, 'Route not Found'));
})

export default router;