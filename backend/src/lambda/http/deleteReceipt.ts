import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils';
import { deleteReceipt } from '../../businessLogic/receipt';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const receiptId = event.pathParameters.receiptId
  const userId = getUserId(event);

  // RECEIPT: Remove a RECEIPT item by id
  await deleteReceipt(userId, receiptId)
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