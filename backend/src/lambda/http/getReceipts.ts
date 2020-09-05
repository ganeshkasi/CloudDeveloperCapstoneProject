import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { getUserId } from '../utils';
import { getReceipts } from '../../businessLogic/receipt';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // RECEIPT: Get all RECEIPT items for a current user
  const userId = getUserId(event);
  const items = await getReceipts(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)

