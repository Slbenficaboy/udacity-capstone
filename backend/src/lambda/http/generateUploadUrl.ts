import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {HaircutBL} from "../../businessLogic/haircut";
import {getUserId} from "../utils";

const haircutBL = new HaircutBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const haircutId = event.pathParameters.haircutId
    const userId = getUserId(event);
    let statuscode = 201
    let headers = {
        'Access-Control-Allow-Origin': '*'
    }
    const uploadUrl: string = await haircutBL.createAttachment(haircutId, userId);

    if (!uploadUrl) {
        statuscode = 404
    }

    return {
        statusCode: statuscode,
        headers: headers,
        body: JSON.stringify({uploadUrl})
    }
}
