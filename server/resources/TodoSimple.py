#! /bin/env/python3
from unicodedata import name
from flask import Flask, request
from flask_restful import Resource, reqparse, abort
from flask_apispec import marshal_with, doc, use_kwargs
from flask_apispec.views import MethodResource
from marshmallow import Schema, fields

#* this is the attributes in the request object
#! https://tedboy.github.io/flask/generated/generated/flask.Request.html

# todo parcel the schemas in their own directories
class TodoResponseSchema(Schema):
    message = fields.Str(default='Success')
    todo_name = fields.Str(default='')

class PostTodoRequestSchema(Schema):
    todo_name = fields.Str(required=True, description="Name of new todo")

todos = {}

class TodoSimple(MethodResource, Resource):

    @doc(description='Get todo by name.', tags=['Todo'])
    @marshal_with(TodoResponseSchema)  # marshalling
    def get(self, todo_name):

        if (todo_name not in todos):
            abort(404, message=f"Todo {todo_name} does not exist")
        # ! you would want some error handling, and code returning
        custom_header = {}
        return ({'message': 'Success', 'todo_name': todos[todo_name]}, 200, custom_header)

    def delete(self, todo_name):
        if (todo_name not in todos):
            abort(404, message=f"Todo {todo_name} does not exist")
        # ? seems pretty barbaric to use del here
        del todos[todo_name]

    @doc(description='Create a new todo', tags=['Todo'])
    @use_kwargs(PostTodoRequestSchema, location=('json'))
    @marshal_with(TodoResponseSchema)  # marshalling
    def post(self, **kwargs):
        print("THSI IS THE KWARS", kwargs)
        print(kwargs['todo_name'])
        todos[kwargs['todo_name']] = kwargs['todo_name']
        print("Got here")
        return ({'message': 'Success', 'todo_name': kwargs['todo_name']})

    # def patch(self, todo_name):
    #     args = parser.parse_args()

    #     # * check you don't already have one of the same name
    #     # * if u do, patch it

    #     todos[todo_name] = {'task': args['task']}
    #     return ({todo_name: todos[todo_name]})

class TodoList(Resource):
    def get(self):
        return (todos)