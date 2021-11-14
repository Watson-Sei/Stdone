import express from 'express';
const router: express.Router = express.Router();
const user = require('../controllers/auth.controller');

router.get('/twitch', user.twitch);
router.get('/twitch/callback', user.twitchCallback);

module.exports = router;