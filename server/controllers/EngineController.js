const EngineHandler = require('../services/EngineHandler');

analysePosition = async (req, res) =>
{
    const body = req.body;

    // * empty or no body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a position',
        })
    }

    console.log("Got body; ", body);

    // * call up the engine handler
    const fenPosition = body.fenPosition;
    const depth = body.hasOwnProperty("maxDepth") ? body.maxDepth : 12;

    EngineHandler.AnalysePosition(fenPosition, depth)
                .then(analysis => {
                    return (res.status(200).json(analysis));
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'Could not analyse !',
                    })
                });

    return (res.status(404));
}

analysePositionArray = async (req, res) =>
{
    const body = req.body;

    // * empty or no body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a position',
        })
    }

    console.log("Got body; ", body);

    // * call up the engine handler
    const depth = body.hasOwnProperty("maxDepth") ? body.maxDepth : 12;

    let analysedPositions = [];

    for (let i = 0; i < body.fenPositions.length; i++) {
        const fenPosition = body.fenPositions[i];

        await EngineHandler.AnalysePosition(fenPosition, depth)
        .then(analysis => {
            analysedPositions.push(analysis);
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Could not analyse !',
            })
        });
    }

    return (res.status(200).json(analysedPositions));
}

module.exports = {
    analysePosition,
    analysePositionArray
}