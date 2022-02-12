const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Stockfish analyser',
            description: "Analyzes chess positions mostly",
            version: '1.0.0',
        },
        host: "localhost:3000",
        basePath: "/api",
    },
    apis: ['./routes/*.js'], // files containing annotations, you can also pass in premade yamls
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = openapiSpecification;