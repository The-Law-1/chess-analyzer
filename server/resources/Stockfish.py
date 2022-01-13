#! /bin/env/python3
from flask import Flask, request
from flask_restful import Resource, reqparse, abort

import chess
import chess.engine

#! this is useful if you have fields in the form that you want to watch
stockfishParser = None
boardParser = None
# parser.add_argument('task', type=int, required=true, help="cannot convert...")

engine = None
board = None

engineOptions = {
    # * cpu threads I suppose
    "Threads": {"type":int, "min": 1, "max": 512, "default": 1},
    # * value in memory for hash tables (the things for endgames i think ?)
    "Hash": {"type":int, "min": 1, "max": 33554432, "default": 16},
    # * is the engine allowed to ponder while you think as well (not sure) ?
    "Ponder": {"type": bool, "default": False},
    # * multi best line 
    "MultiPV": {"type": int, "min": 1, "max": 500, "default": 1},
    # * level of skill
    "Skill": {"type": int, "min": 0, "max": 20, "default": 20},
    # * time penalty, in case you expect lags
    "Move Overhead": {"type": int, "min": 0, "max": 5000, "default": 10},
    # * tells the engine to use more or less time
    "Slow Mover": {"type": int, "min": 10, "max": 1000, "default": 100},
    # * Tells the engine to use nodes searched instead of wall time to account for elapsed time. Useful for engine testing.
    "nodestime": {"type": int, "min": 0, "max": 10000, "default": 0},
    # * if true, Stockfish will play Chess960.
    "UCI_Chess960": {"type": bool, "default": False},
    # * enable weaker play aiming for an elo rating set by UCI_Elo
    "UCI_LimitStrength": {"type": bool, "default": False},
    # * If enabled by UCI_LimitStrength, aim for an engine strength of the given Elo
    "UCI_Elo": {"type": int, "min": 1350, "max": 2850, "default": 1350 },
    # * use NNUE evaluation (neural network)
    "NNUE": {"type": bool, "default": True}
}

def main():
    global board, engine, stockfishParser
    engine = chess.engine.SimpleEngine.popen_uci('/home/gabriel/Pers/chess_analyzer/server/engine/stockfish')
    board = chess.Board()
    stockfishParser = reqparse.RequestParser()
    boardParser = reqparse.RequestParser()

    boardParser.add_argument("fenString")

    print(engineOptions.keys())
    for key in engineOptions.keys():
        stockfishParser.add_argument(key)

main()
engine.quit()

# * this is the attributes in the request object
# ! https://tedboy.github.io/flask/generated/generated/flask.Request.html

class BoardInterface(Resource):

    # * list of shit this board can do
    # * https://python-chess.readthedocs.io/en/latest/core.html#board
    # * put: set the fen
    def put(self, fenString):
        args = boardParser.parse_args()

        fenString = args['fenString']
        board.set_fen(fenString)

        # ! this is not a valid json probably (and in any case if you use bools)
        #! https://pythonexamples.org/convert-python-class-object-to-json/
        if (board.is_valid()):
            return ({"position": board.board_fen()}, 200)
        else:
            abort(400, message="Invalid Fen")

class StockfishInterface(Resource):

    # * get: analyze the current board
    def get(self):
        info = engine.analyse(board, chess.engine.Limit(depth=20, time=1))

        return ({}, 200)

    # * put: change settings
    def put(self, todo_name):
        # * if we find something in the request that is not supposed to be there, throws an error
        args = stockfishParser.parse_args(strict=True)
