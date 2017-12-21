export const APP_INITIAL_DATA = {
  group: '',
  name: '',
  description: '',
  apiPrefix: '/api',
  enabled: true,
  responseTemplate:
`{
  "code": 200, // Business code ( 200: OK, 500: BAD )
  "msg": "Get response successfully.", // Server message
  "data": {} // API response data
}`
};

export const API_INITIAL_DATA = {
  name: 'NEW API',
  method: 'GET',
  enabled: true,
  failRate: 0,
  failStatus: 500,
  successStatus: 200,
  url: '',
  request: "{\n  \n}",
  delay: 0
};

export const HTTP_STATUS = ['200', '201', '301', '302', '304', '401', '404', '500', '502'];