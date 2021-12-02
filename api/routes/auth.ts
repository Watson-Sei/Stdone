import express from 'express';
const router: express.Router = express.Router();
const user = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

// Twitch Oauth2.0
// router.get('/twitch', user.twitch);
router.get('/twitch/callback', user.twitchCallback);
// Youtube Oauth2.0
// router.get('/youtube', user.youtube);
router.get('/youtube/callback', user.youtubeCallback);

router.get('/me', auth, user.me);

// Update Wallet Address
router.put('/me/wallet', auth, user.wallet);

module.exports = router;