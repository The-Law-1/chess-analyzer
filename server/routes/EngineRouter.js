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
 *               maxDepth:
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

/**
 * @swagger
 * /api/engine/analysePositions:
 *   post:
 *     summary: Analyses the positions
 *     description: One analysis = three best lines, score, best move
 *     requestBody:
 *       description: array of fen positions and depth (optional)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fenPositions:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxDepth:
 *                 type: integer
 *             required:
 *               - fenPositions
 *     responses:
 *       200:
 *         description: Returns an object containing the analysis
 */
engineRouter.post('/api/engine/analysePositions', analysePositionArray);


module.exports = engineRouter;