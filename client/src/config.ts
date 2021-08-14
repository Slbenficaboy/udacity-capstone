// DONE: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'id9t8npefg'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // DONE: Create an Auth0 application and copy values from it into this 
  domain: 'dev-gasqe1x0.us.auth0.com',
  clientId: 'kvLG2uqwO9pHqMicgrrluXDTJmntqgDZ',
  callbackUrl: 'http://localhost:3000/callback'
}