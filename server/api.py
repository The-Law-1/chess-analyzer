#! /bin/env/python3

from flask import Flask
from flask_restful import Resource, Api
from resources.HelloWorld import HelloWorld
from resources.TodoSimple import TodoSimple
from resources.TodoSimple import TodoList

app = Flask(__name__)
api = Api(app)

# * you can pass multiple urls here
api.add_resource(HelloWorld, "/hello", "/hello-world")

api.add_resource(TodoSimple, "/todo/<string:todo_name>")
api.add_resource(TodoList, "/todos")

# * essentially a guard
if (__name__ == '__main__'):
    app.run(debug=True)