import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {TodoBL} from "../../businessLogic/todo";
import {getUserId} from "../utils";

const todoBL = new TodoBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // DONE: Get all TODO items for a current user
    let statusCode = 200
    let headers = {
        'Access-Control-Allow-Origin': '*'
    }

    return {
        statusCode: statusCode,
        headers: headers,
        body: JSON.stringify({items: await todoBL.findAll(getUserId(event))})
    }
}
