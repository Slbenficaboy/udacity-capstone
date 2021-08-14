import {DocumentClient} from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
import {TodoItem} from "../models/TodoItem";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {S3} from "aws-sdk/clients/browser_default";

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
    constructor(
        private readonly dynamodb: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3: S3 = new XAWS.S3({signatureVersion: 'v4'}),

        private readonly todoTable: string = process.env.TODOS_TABLE,
        private readonly index: string = process.env.TODO_INDEX,
        private readonly todoS3Bucket: string = process.env.TODO_S3_BUCKET
    ) {
    }

    async saveTodo(todo: TodoItem) {
        await this.dynamodb.put({
            TableName: this.todoTable,
            Item: todo
        }).promise()
    }

    async updateTodo(todoId: string, userId: string, updateTodoData: UpdateTodoRequest) {
        await this.dynamodb.update({
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set #name = :name, #dueDate = :duedate, #done = :done',
            ExpressionAttributeValues: {
                ':name': updateTodoData.name,
                ':duedate': updateTodoData.dueDate,
                ':done': updateTodoData.done
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            }
        }).promise()
    }

    async deleteTodo(todoId: string, userId: string) {
        await this.dynamodb.delete({
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise()
    }

    async findTodo(todoId: string, userId: string): Promise<TodoItem> | undefined {
        const result = await this.dynamodb.get({
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise()

        if (!result.Item) {
            return undefined
        }

        return result.Item as TodoItem
    }

    async getTodos(userId: string) {
        const result = await this.dynamodb.query({
            TableName: this.todoTable,
            IndexName: this.index,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return result.Items
    }

    async attachToTodo(todoId: string, userId: string) {
        await this.dynamodb.update({
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :url',
            ExpressionAttributeValues: {
                ':url': `https://${process.env.TODO_S3_BUCKET}.s3.amazonaws.com/${todoId}`
            }
        }).promise()
    }

    getTodoUploadURL(todoId: string) {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.todoS3Bucket,
            Key: todoId,
            Expires: 500
        })
    }
}