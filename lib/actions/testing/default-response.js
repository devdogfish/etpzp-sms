export const SuccessResponse = {
  status: 200,
  statusText: "OK",
  headers: {
    "content-length": "89",
    "content-type": "application/json",
    date: "Sun, 02 Feb 2025 13:03:24 GMT",
    "strict-transport-security": "max-age=31536000",
    "x-server": "GatewayAPI",
  },
  body: { locked: false, state: "readable", supportsBYOB: true },
  bodyUsed: false,
  ok: true,
  redirected: false,
  type: "basic",
  url: "https://gatewayapi.com/rest/mtsms",
};

export const SuccessResponseJson = {
  ids: [4382703917],
  usage: { countries: { DE: 1 }, currency: "EUR", total_cost: 0.0642 },
};

/**
 * Cancel scheduled responses
 Response {
  status: 410,
  statusText: 'Gone',
  headers: Headers {
    'content-length': '3',
    'content-type': 'application/json',
    date: 'Wed, 05 Feb 2025 12:10:48 GMT',
    'strict-transport-security': 'max-age=31536000',
    'x-server': 'GatewayAPI'
  },
  body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
  bodyUsed: false,
  ok: false,
  redirected: false,
  type: 'basic',
  url: 'https://gatewayapi.com/rest/mtsms/4382980628'
}
 */
