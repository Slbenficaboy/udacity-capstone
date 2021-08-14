import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import {TodoBL} from "../../businessLogic/todo";
import {getUserId} from "../utils";

const todoBL = new TodoBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // DONE: Implement creating a new TODO item
    const userId: string = getUserId(event)
    let statusCode = 201
    let headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    return {
        statusCode: statusCode,
        headers: headers,
        body: JSON.stringify({item: await todoBL.createNew(newTodo, userId)})
    }
}
