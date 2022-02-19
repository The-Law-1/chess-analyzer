const express = require('express')
const { analysePosition, doSomething} = require('../controllers/EngineController');

const engineRouter = express.Router()

/**
 * @swagger
 * /api/engine/analyse:
 *   get:
 *     summary: Analyses the position
 *     description: Returns the three best lines, analysis, best move
 *     responses:
 *       200:
 *         description: Returns an object containing the analysis
 */
// todo read this to pass parameters in the requestBody
// * https://swagger.io/docs/specification/describing-request-body/
// todo include a response example
engineRouter.get('/api/engine/analyse', analysePosition);

module.exports = engineRouter;