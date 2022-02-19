const express = require('express')

const testRouter = express.Router()

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Says hello
 *     description: Say hello to the api
 *     responses:
 *       200:
 *         description: Returns a greeting
 */
testRouter.get('/api/hello', (req, res) => {
    res.send('Hello World!');
});

/**
 * @swagger
 * /api/isPositive/{num}:
 *   get:
 *     summary: Is the number positive
 *     description: Returns "Positive" or "Negative"
 *     parameters:
 *       - name: num
 *         description: Number to evaluate
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Returns the result
 */
testRouter.get('/api/isPositive/:num', (req, res) => {
    res.send(req.params.num > 0 ? "Positive" : "Negative");
});

module.exports = testRouter;