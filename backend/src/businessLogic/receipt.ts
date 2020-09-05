import 'source-map-support/register'
import * as uuid from 'uuid'

import { ReceiptItem } from '../models/ReceiptItem'
import { ReceiptAccess } from '../dataLayer/receiptAccess'
import { CreateReceiptRequest } from '../requests/CreateReceiptRequest'
import { ReceiptUpdate } from '../models/ReceiptUpdate'
import { UpdateReceiptRequest } from '../requests/UpdateReceiptRequest'

const receipt = new ReceiptAccess()
const bucketName = process.env.RECEIPTS_S3_BUCKET

export async function getReceipts(userId: string): Promise<ReceiptItem[]> {
    return await receipt.getReceipts(userId)
}

export async function createReceipt(
    createReceiptRequest: CreateReceiptRequest,
    userId: string
    ): Promise<ReceiptItem> {
    const receiptId = uuid.v4()
    const newReceipt: ReceiptItem = {
        userId: userId,
        receiptId: receiptId,
        createdAt: new Date().toISOString(),
        amount: createReceiptRequest.amount,
        name: createReceiptRequest.name,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${receiptId}`
    }

    return await receipt.createReceipt(newReceipt)
}

export async function updateReceipt(
    userId: string,
    receiptId: string,
    updateReceiptRequest: UpdateReceiptRequest
    ): Promise<ReceiptUpdate> {

    const updatedReceipt: ReceiptUpdate = {
        name: updateReceiptRequest.name,
        amount: updateReceiptRequest.amount
    }

    return await receipt.updateReceipt(userId, receiptId, updatedReceipt)
}

export async function deleteReceipt(userId: string, receiptId: string): Promise<String>  {
    return await receipt.deleteReceipt(userId, receiptId)
}

export async function generateUploadUrl(receiptId: string):  Promise<String>{
    return await receipt.generateUploadUrl(receiptId)
}

export async function receiptExist(userId: string, receiptId: string): Promise<boolean>{
    return await receipt.receiptExist(userId, receiptId)
}