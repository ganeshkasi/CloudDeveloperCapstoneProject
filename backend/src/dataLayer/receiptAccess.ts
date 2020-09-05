import * as AWS  from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ReceiptItem } from '../models/ReceiptItem'
import { ReceiptUpdate } from '../models/ReceiptUpdate'
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({signatureVersion: 'v4'})
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class ReceiptAccess{
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly receiptTable = process.env.RECEIPTS_TABLE,
        private readonly bucketName = process.env.RECEIPTS_S3_BUCKET) {}

    //add receipt item to dynamodb
    async createReceipt(receiptItem: ReceiptItem): Promise<ReceiptItem>  {
        await this.docClient.put({
            TableName: this.receiptTable,
            Item: receiptItem
        }).promise()

        return receiptItem
    }        
    
    async getReceipts(userId: string): Promise<ReceiptItem[]> {
        const result = await this.docClient.query({
            TableName: this.receiptTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as ReceiptItem[]
    }

    async updateReceipt(userId: string, receiptId: string, receiptUpdate: ReceiptUpdate): Promise<ReceiptUpdate> {
        var params = {
            TableName: this.receiptTable,
            Key: {
                userId: userId,
                receiptId: receiptId
            },
            UpdateExpression: "set #n = :a, amount=:m",
            ExpressionAttributeValues: {
                ":a": receiptUpdate.name,
                ":m": receiptUpdate.amount,
            },
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ReturnValues: "UPDATED_NEW"
        };

        await this.docClient.update(params).promise()
        return receiptUpdate
    }
    
    async deleteReceipt(userId: string, receiptId: string): Promise<String> {
        await this.docClient.delete({
            TableName: this.receiptTable,
            Key: {
                userId: userId,
                receiptId: receiptId
            }
        }).promise()
        
        return ''
    }

    async generateUploadUrl(receiptId: string): Promise<String> {
        return getUploadUrl(receiptId, this.bucketName)
       
    }

    async receiptExist(userId: string, receiptId: string): Promise<boolean> {
        const result = await this.docClient
            .get({
                TableName: this.receiptTable,
                Key: {
                    userId: userId,
                    receiptId: receiptId
                }
            }).promise()

        return !!result.Item
    }
}


function getUploadUrl(receiptId: string, bucketName: string): string {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: receiptId,
        Expires: parseInt(urlExpiration)
    })
}

function createDynamoDBClient() {
    //using local dynamodb offline
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
}
