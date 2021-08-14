import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {TodoBL} from "../../businessLogic/todo";
import {getUserId} from "../utils";

const todoBL = new TodoBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    // DONE: Remove a TODO item by id
    const userId = getUserId(event);
    const deletedTodo = await todoBL.delete(todoId, userId);
    let statusCode = 200
    let headers = {
        'Access-Control-Allow-Origin': '*'
    }

    if (!deletedTodo) {
        statusCode = 404
    }

    return {
        statusCode: statusCode,
        headers: headers,
        body: JSON.stringify({})
    };
}
