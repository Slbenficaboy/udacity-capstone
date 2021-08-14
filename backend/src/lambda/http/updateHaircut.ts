import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateHaircutAppointment } from '../../requests/UpdateHaircutAppointment'

import {HaircutBL} from "../../businessLogic/haircut";
import {getUserId} from "../utils";

const haircutBL = new HaircutBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const haircutId = event.pathParameters.haircutId
    const updatedHaircut: UpdateHaircutAppointment = JSON.parse(event.body)
    let statuscode = 200
    let headers = {
        'Access-Control-Allow-Origin': '*'
    }
    const userId = getUserId(event);

    const haircut = await haircutBL.update(haircutId, updatedHaircut, userId);
    if (!haircut) {
        statuscode = 404
    }

    return {
        statusCode: statuscode,
        headers: headers,
        body: JSON.stringify({})
    }
}
