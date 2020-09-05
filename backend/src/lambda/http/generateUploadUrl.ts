import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils';
import { generateUploadUrl, receiptExist } from '../../businessLogic/receipt';
import { cors } from 'middy/middlewares';
import * as middy from 'middy';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const receiptId = event.pathParameters.receiptId
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

  // RECEIPT: Return a presigned URL to upload a file for a RECEIPT item with the provided id
  let url = await generateUploadUrl(receiptId)
  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)