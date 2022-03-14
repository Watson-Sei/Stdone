import express from 'express';
const router: express.Router = express.Router();
const user = require('../controllers/user.controller');

router.get('/donateUser/:username', user.donateUser);

module.exports = router;