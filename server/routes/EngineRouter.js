const express = require('express')
const engineCtrl = require('../controllers/EngineController');

const engineRouter = express.Router()

engineRouter.get('/api/engine/analyse', engineCtrl.analysePosition);

module.exports = engineRouter;