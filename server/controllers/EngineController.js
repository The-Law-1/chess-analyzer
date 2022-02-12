const EngineHandler = require('../services/EngineHandler');

analysePosition = (req, res) =>
{
    const body = req.body

    // * empty or no body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a position',
        })
    }

    // * call up the engine handler

    return (res.status(200).json({
        success: true
    }));
}

module.exports = {
    analysePosition
}