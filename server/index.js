const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');

const engine = require('./services/EngineHandler');

const swaggerDocument = require('./doc/swagger.json');

const apiPort = 3000;

const engineRouter = require('./routes/EngineRouter');
// const jwtRouter = require('./routes/jwt-router');
// const nbaRouter = require('./routes/nba-router');
// const cryptoRouter = require('./routes/crypto-router');
// const unsplashRouter = require('./routes/unsplash-router');
// const hearthstoneRouter = require('./routes/hearthstone-router');
// const quotesRouter = require('./routes/quotes-router');
// const prefsRouter = require('./routes/user-prefs-router');
// const aboutRouter = require('./routes/about-router');

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/hello', (req, res) => {
    res.send('Hello World!')
});

app.get('/api/isPositive/:num', (req, res) => {
    res.send(req.params.num > 0 ? "Positive" : "Negative");
});

// app.use('/api', userRouter);
app.use(engineRouter);
// app.use(
//     userRouter,
//     jwtRouter,
//     nbaRouter,
//     cryptoRouter,
//     unsplashRouter,
//     hearthstoneRouter,
//     quotesRouter,
//     prefsRouter,
//     aboutRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))