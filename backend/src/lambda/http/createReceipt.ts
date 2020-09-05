import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateReceiptRequest } from '../../requests/CreateReceiptRequest'
import { cors } from 'middy/middlewares'
import { createReceipt} from '../../businessLogic/receipt'
import * as middy from 'middy'
import { getUserId } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newReceipt: CreateReceiptRequest = JSON.parse(event.body)
  const userId = getUserId(event);
  // RECEIPT: Implement creating a new RECEIPT item
  const receiptItem = await createReceipt(newReceipt, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({item: receiptItem})
  }
})

handler.use(
  cors({
    credentials: true
  })
)