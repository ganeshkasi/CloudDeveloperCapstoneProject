import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateReceiptRequest } from '../../requests/UpdateReceiptRequest'
import { getUserId } from '../utils'
import { updateReceipt, receiptExist } from '../../businessLogic/receipt'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const receiptId = event.pathParameters.receiptId
  const updatedReceipt: UpdateReceiptRequest = JSON.parse(event.body)
  const userId = getUserId(event);
  const validItem = await receiptExist(userId, receiptId)

  if (!validItem) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: `Unable to find Receipt'${receiptId}' for user '${userId}'`
      })
    }
  }

  await updateReceipt(userId, receiptId, updatedReceipt)
  return {
    statusCode: 200,
    body: " "
  }
})

handler.use(
  cors({
    credentials: true
  })
)

