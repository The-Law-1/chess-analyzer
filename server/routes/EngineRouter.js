const express = require('express')
const { analysePosition, doSomething} = require('../controllers/EngineController');

const engineRouter = express.Router()

/**
 * @swagger
 * /api/engine/analyse:
 *   get:
 *     summary: Analyses the position
 *     description: Returns the three best lines, analysis, best move
 *     parameters:
 *       - name: fenPosition
 *         description: Current position in FEN notation
 *         in: formData
 *         required: true
 *         type: string
 *       - name: maxDepth
 *         description: Max depth for UCI engine (12 by default)
 *         in: formData
 *         required: false
 *         type: number
 *     responses:
 *       200:
 *         description: Returns an object containing the analysis
 */
// todo include a response example
engineRouter.get('/api/engine/analyse', analysePosition);

module.exports = engineRouter;