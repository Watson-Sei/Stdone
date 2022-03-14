import express from 'express';
const router: express.Router = express.Router();
const auth = require('./auth');
const user = require('./user');

router.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World');
})

router.use('/auth', auth);
router.use('/user', user);

module.exports = router;