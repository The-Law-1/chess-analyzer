// import { Engine } from "node-uci";
const Engine = require('node-uci').Engine

const engine = new Engine("./engine/stockfish");

async function TestEngine()
{
    await engine.init();

    // * cf https://gist.github.com/abarax/b93000b1d5c3b2db5803
    // * interesting options include:
    // * MultiPV, multi best line or k-best, default 1
    // * UCI_LimitStrength boolean (or check)
    // * UCI_Elo, if limitstrength is enabled, play at elo
    await engine.setoption("MultiPV", '3');
    await engine.isready();

    // await engine.position("rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3");
    // console.log("engine ready", engine.id, engine.options);
    const result = await engine.go({depth: 10, searchmoves: 1});

    // console.log('Result ', result);
    // console.log('Score ', result.info[1].score);

    await engine.quit();
}

// * other request to modify the parameters, take them in the url so it's easier ?
// * or in the body and good luck documenting them

// * returns the best move, score, and 3 best lines ?
async function AnalysePosition(fenPosition, maxDepth=12)
{
    await engine.init();
    console.log("Engine initialized");
    await engine.isready();
    console.log("Engine ready");

    // * set your options here, cf testEngine
    await engine.setoption("MultiPV", "3");

    console.log("MultiPV set");

    console.log("FEN POSITION ", fenPosition);
    console.log("Depth ", maxDepth);

    // ! catch the bad fen position
    try {
        await engine.position(fenPosition);
    } catch (error) {
        console.log("Bad fen position ! ", fenPosition);

        throw Error("Could not set position : " + fenPosition);
    }

    console.log("Launching engine", engine.id, engine.options);
    const result = await engine.go({depth: maxDepth});

    console.log('Result ', result);

    let bestInfo = result.info.slice(-3);
    // * default is centipawns for the score so get ready to divide and conquer
    let bestLines = bestInfo.map(info => ({pv: info.pv, score: info.score.value}));

    const analysis = {
        bestmove: result.bestmove,
        bestLines,
    }

    console.log(analysis);

    await engine.quit();
    return (analysis);
}

async function AnalysePositions(fenPositions, maxDepth = 12)
{
    await engine.init();
    console.log("Engine initialized");
    await engine.isready();
    console.log("Engine ready");

    let multiPVValue = 3;
    // * set your options here, cf testEngine
    await engine.setoption("MultiPV", `${multiPVValue}`);

    console.log("MultiPV set");

    console.log("Depth ", maxDepth);

    let fullResult = [];

    for (let i = 0; i < fenPositions.length; i++) {
        if (i === 0) {
            fullResult.push({
                bestmove: "e2e4",
                bestLines: [{
                    pv: [],
                    score: 0.2
                }]
            });
            // * return equal score and bestMove e2e4
        } else {

            const fenPosition = fenPositions[i - 1];


            // ! catch the bad fen position
            try {
                await engine.position(fenPosition);
            } catch (error) {
                console.log("Bad fen position ! ", fenPosition);

                throw Error("COuld not set position : " + fenPosition);
            }

            const result = await engine.go({depth: maxDepth});

            let bestInfo = result.info.slice(-multiPVValue);
            // * default is centipawns for the score so get ready to divide and conquer
            let bestLines = bestInfo.map(info => ({pv: info.pv, score: i % 2 === 0 ? info.score.value : -info.score.value}));

            const analysis = {
                bestmove: result.bestmove,
                bestLines,
            }
            fullResult.push(analysis);
        }
        console.log(`Done with move ${i}`);
    }

    await engine.quit();
    return (fullResult);
}

// AnalysePosition("1k5r/2p3pp/2p5/p7/8/P1B1n1rP/1P2B1P1/2R2RK1 w - - 0 25")


module.exports = {
    TestEngine,
    AnalysePosition,
    AnalysePositions
}