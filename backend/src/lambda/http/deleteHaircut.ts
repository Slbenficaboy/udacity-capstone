import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {HaircutBL} from "../../businessLogic/haircut";
import {getUserId} from "../utils";

const haircutBL = new HaircutBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const haircutId = event.pathParameters.haircutId
    const userId = getUserId(event);
    const deletedHaircut = await haircutBL.delete(haircutId, userId);
    let statusCode = 200
    let headers = {
        'Access-Control-Allow-Origin': '*'
    }

    if (!deletedHaircut) {
        statusCode = 404
    }

    return {
        statusCode: statusCode,
        headers: headers,
        body: JSON.stringify({})
    };
}
