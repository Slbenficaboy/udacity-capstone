import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import {TodoBL} from "../../businessLogic/todo";
import {getUserId} from "../utils";

const todoBL = new TodoBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    // DONE: Update a TODO item with the provided id using values in the "updatedTodo" object
    let statuscode = 200
    let headers = {
        'Access-Control-Allow-Origin': '*'
    }
    const userId = getUserId(event);

    const todo = await todoBL.update(todoId, updatedTodo, userId);
    if (!todo) {
        statuscode = 404
    }

    return {
        statusCode: statuscode,
        headers: headers,
        body: JSON.stringify({})
    }
}
