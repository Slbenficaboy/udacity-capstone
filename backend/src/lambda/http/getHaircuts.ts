import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {HaircutBL} from "../../businessLogic/haircut";
import {getUserId} from "../utils";

const haircutBL = new HaircutBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let statusCode = 200
    let headers = {
        'Access-Control-Allow-Origin': '*'
    }

    return {
        statusCode: statusCode,
        headers: headers,
        body: JSON.stringify({items: await haircutBL.findAll(getUserId(event))})
    }
}
