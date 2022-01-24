#! /bin/env/python3

from flask import Flask
from flask_restful import Resource, Api
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask_apispec.extension import FlaskApiSpec
from resources.HelloWorld import HelloWorld
from resources.TodoSimple import TodoSimple
from resources.TodoSimple import TodoList

app = Flask(__name__)
api = Api(app)

app.config.update({
    'APISPEC_SPEC': APISpec(
        title='Chess analyser',
        version='v1',
        plugins=[MarshmallowPlugin()],
        openapi_version='2.0.0'
    ),
    'APISPEC_SWAGGER_URL': '/swagger/',  # URI to access API Doc JSON
    'APISPEC_SWAGGER_UI_URL': '/swagger-ui/'  # URI to access UI of API Doc
})

docs = FlaskApiSpec(app)

# * you can pass multiple urls here
api.add_resource(HelloWorld, "/hello", "/hello-world")

api.add_resource(TodoSimple, "/todo/<string:todo_name>")
docs.register(TodoSimple)

api.add_resource(TodoList, "/todos")

# * essentially a guard
if (__name__ == '__main__'):
    app.run(debug=True)