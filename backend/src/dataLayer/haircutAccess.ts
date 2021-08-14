import {DocumentClient} from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
import {HaircutAppointment} from "../models/HaircutAppointment";
import {UpdateHaircutAppointment} from "../requests/UpdateHaircutAppointment";
import {S3} from "aws-sdk/clients/browser_default";

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class HaircutAccess {
    constructor(
        private readonly dynamodb: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3: S3 = new XAWS.S3({signatureVersion: 'v4'}),

        private readonly haircutTable: string = process.env.HAIRCUT_TABLE,
        private readonly index: string = process.env.HAIRCUT_INDEX,
        private readonly haircutS3Bucket: string = process.env.HAIRCUT_S3_BUCKET
    ) {
    }

    async saveHaircut(haircut: HaircutAppointment) {
        await this.dynamodb.put({
            TableName: this.haircutTable,
            Item: haircut
        }).promise()
    }

    async updateHaircut(haircutId: string, userId: string, updateHaircutAppointment: UpdateHaircutAppointment) {
        await this.dynamodb.update({
            TableName: this.haircutTable,
            Key: {
                userId: userId,
                haircutId: haircutId
            },
            UpdateExpression: 'set #name = :name, #appointmentDate = :appointmentDate, #done = :done',
            ExpressionAttributeValues: {
                ':name': updateHaircutAppointment.name,
                ':appointmentDate': updateHaircutAppointment.appointmentDate,
                ':done': updateHaircutAppointment.done
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#appointmentDate': 'appointmentDate',
                '#done': 'done'
            }
        }).promise()
    }

    async deleteHaircut(haircutId: string, userId: string) {
        await this.dynamodb.delete({
            TableName: this.haircutTable,
            Key: {
                userId: userId,
                haircutId: haircutId
            }
        }).promise()
    }

    async findHaircut(haircutId: string, userId: string): Promise<HaircutAppointment> | undefined {
        const result = await this.dynamodb.get({
            TableName: this.haircutTable,
            Key: {
                userId: userId,
                haircutId: haircutId
            }
        }).promise()

        if (!result.Item) {
            return undefined
        }

        return result.Item as HaircutAppointment
    }

    async getHaircuts(userId: string) {
        const result = await this.dynamodb.query({
            TableName: this.haircutTable,
            IndexName: this.index,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return result.Items
    }

    async attachToHaircut(haircutId: string, userId: string) {
        await this.dynamodb.update({
            TableName: this.haircutTable,
            Key: {
                userId: userId,
                haircutId: haircutId
            },
            UpdateExpression: 'set attachmentUrl = :url',
            ExpressionAttributeValues: {
                ':url': `https://${process.env.HAIRCUT_S3_BUCKET}.s3.amazonaws.com/${haircutId}`
            }
        }).promise()
    }

    getHaircutUploadURL(haircutId: string) {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.haircutS3Bucket,
            Key: haircutId,
            Expires: 500
        })
    }
}