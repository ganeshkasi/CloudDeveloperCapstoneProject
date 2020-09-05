// RECEIPT: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'rsbrw5is16'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // RECEIPT: Create an Auth0 application and copy values from it into this map
  domain: 'dev-56kp3cuf.us.auth0.com', // Auth0 domain
  clientId: 'IHcWcPCfu0vss1AhnvsNREMQdLL7dTZ0',           // Auth0 client id
  callbackUrl: `${window.location.origin}/callback`
}
