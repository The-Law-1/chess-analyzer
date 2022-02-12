const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');

const engine = require('./services/EngineHandler');
const generatedDocumentation = require('./doc/Generator');

// const swaggerDocument = require('./doc/swagger.json');

const apiPort = 3000;

const testRouter = require('./routes/Test');
const engineRouter = require('./routes/EngineRouter');

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(generatedDocumentation));


app.use(testRouter, engineRouter);


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))