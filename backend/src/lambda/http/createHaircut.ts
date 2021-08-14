import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateHaircutAppointment } from '../../requests/CreateHaircutAppointment'

import {HaircutBL} from "../../businessLogic/haircut";
import {getUserId} from "../utils";

const haircutBL = new HaircutBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newHaircutAppointment: CreateHaircutAppointment = JSON.parse(event.body)
    const userId: string = getUserId(event)
    let statusCode = 201
    let headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    return {
        statusCode: statusCode,
        headers: headers,
        body: JSON.stringify({item: await haircutBL.createNew(newHaircutAppointment, userId)})
    }
}
