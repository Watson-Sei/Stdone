import express from 'express';
const router: express.Router = express.Router();
const auth = require('./auth');

router.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World');
})

router.use('/auth', auth);

module.exports = router;