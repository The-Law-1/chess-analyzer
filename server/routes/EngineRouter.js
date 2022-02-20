const express = require('express')
const { analysePosition, doSomething} = require('../controllers/EngineController');

const engineRouter = express.Router()

/**
 * @swagger
 * /api/engine/analyse:
 *   post:
 *     summary: Analyses the position
 *     description: Returns the three best lines, analysis, best move
 *     requestBody:
 *       description: Fen position and depth (optional)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fenPosition:
 *                 type: string
 *               depth:
 *                 type: integer
 *             required:
 *               - fenPosition
 *     responses:
 *       200:
 *         description: Returns an object containing the analysis
 */
// todo read this to pass parameters in the requestBody
// * https://swagger.io/docs/specification/describing-request-body/
// todo include a response example
engineRouter.post('/api/engine/analyse', analysePosition);

module.exports = engineRouter;