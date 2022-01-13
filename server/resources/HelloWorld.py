#! /bin/env/python3

from flask_restful import Resource


class HelloWorld(Resource):
    currentVal = "world"

    def get(self):
        return ({'hello': self.currentVal})
