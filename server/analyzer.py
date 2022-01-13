#! /bin/env/python3

import chess
import chess.engine

engine = chess.engine.SimpleEngine.popen_uci('./engine/stockfish')

# ! set options:
# * https://gist.github.com/aliostad/f4470274f39d29b788c1b09519e67372
#engine.configure({"key": value})

board = chess.Board()

info = engine.analyse(board, chess.engine.Limit(time=1))
print("All of info: ", info)
print("Score: ", info["score"])

# * https://www.chess.com/analysis/game/live/35122663604
# 8/1pp1k3/p2p1pr1/3Pn3/1P2NRpp/P7/2P3PP/R5K1 w - - 0 28
# rnbqkb1r/pppp1ppp/5n2/4P3/5p2/2N5/PPPP2PP/R1BQKBNR b KQkq - 0 4

board = chess.Board("rnbqkb1r/pppp1ppp/5n2/4P3/5p2/2N5/PPPP2PP/R1BQKBNR b KQkq - 0 4")
info = engine.analyse(board, chess.engine.Limit(depth=20, time=1))
print("Your game")
print("All of info: ", info)
print("Score: ", info["score"])
print(info["score"].wdl())

engine.quit()