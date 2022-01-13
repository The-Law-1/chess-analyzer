#! /bin/env/python3
from flask import Flask, request
from flask_restful import Resource, reqparse, abort

#! this is useful if you have fields in the form that you want to watch
parser = reqparse.RequestParser()
parser.add_argument('task', required=True)

#* this is the attributes in the request object
#! https://tedboy.github.io/flask/generated/generated/flask.Request.html

todos = {}

class TodoSimple(Resource):

    def get(self, todo_name):

        if (todo_name not in todos):
            abort(404, message=f"Todo {todo_name} does not exist")
        # ! you would want some error handling, and code returning
        custom_header = {}
        return ({todo_name: todos[todo_name]}, 200, custom_header)

    def delete(self, todo_name):
        if (todo_name not in todos):
            abort(404, message=f"Todo {todo_name} does not exist")
        # ? seems pretty barbaric to use del here
        del todos[todo_name]


    def put(self, todo_name):
        args = parser.parse_args()

        todos[todo_name] = {'task': args['task']}
        return ({todo_name: todos[todo_name]})

class TodoList(Resource):
    def get(self):
        return (todos)