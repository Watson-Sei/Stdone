import express from 'express';
const router: express.Router = express.Router();
const user = require('../controllers/auth.controller');

// Twitch Oauth2.0
router.get('/twitch', user.twitch);
router.get('/twitch/callback', user.twitchCallback);
// Youtube Oauth2.0
router.get('/youtube', user.youtube);
router.get('/youtube/callback', user.youtubeCallback);

module.exports = router;