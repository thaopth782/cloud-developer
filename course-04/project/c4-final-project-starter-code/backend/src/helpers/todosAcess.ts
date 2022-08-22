import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the dataLayer logic

export class TodoAcess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) { }

  async getAllByUserId(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async create(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()

    return todoItem
  }

  async update(todoItem: TodoUpdate, userId: string, todoId: string) {
    var params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'SET #n = :name, dueDate=:dueDate, done=:done',
      ExpressionAttributeValues: {
        ':name': todoItem.name,
        ':dueDate': todoItem.dueDate,
        ':done': todoItem.done
      },
      ExpressionAttributeNames: {
        '#n': 'name'
      },
      ReturnValues: 'UPDATED_NEW'
    }

    return await this.docClient.update(params).promise()
  }

  async delete(userId: string, todoId: string) {
    return await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId,
      }
    }).promise()
  }

  async updateAttachmentUrl(userId: string, todoId: string, attachmentUrl: string) {
    return await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId,
      },
      UpdateExpression: 'SET attachmentUrl = :attachmentUrl ',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }
}
