// a console.log(res) successful response will give something like this
const successResponse = /**Response */ {
  status: 200,
  statusText: "OK",
  headers: /**Headers */ {
    "content-length": "88",
    "content-type": "application/json",
    date: "Sun, 22 Dec 2024 09:17:28 GMT",
    "strict-transport-security": "max-age=31536000",
    "x-server": "GatewayAPI",
  },
  body: /**ReadableStream */ {
    locked: false,
    state: "readable",
    supportsBYOB: true,
  },
  bodyUsed: false,
  ok: true,
  redirected: false,
  type: "basic",
  url: "https://gatewayapi.com/rest/mtsms",
};

export const errorResponse = /**Response */ {
  status: 422,
  statusText: "Unprocessable Entity",
  headers: /**Headers */ {
    "content-length": "83",
    "content-type": "application/json",
    date: "Sun, 22 Dec 2024 09:10:28 GMT",
    "strict-transport-security": "max-age=31536000",
    "x-server": "GatewayAPI",
  },
  body: /**ReadableStream */ {
    locked: false,
    state: "readable",
    supportsBYOB: true,
  },
  bodyUsed: false,
  ok: false,
  redirected: false,
  type: "basic",
  url: "https://gatewayapi.com/rest/mtsms",
};

const errorResponse2 = /**Response */ {
  status: 403,
  statusText: "Forbidden",
  headers: /**Headers */ {
    "content-length": "122",
    "content-type": "application/json",
    date: "Sun, 22 Dec 2024 09:26:43 GMT",
    "strict-transport-security": "max-age=31536000",
    "x-server": "GatewayAPI",
  },
  body: /**ReadableStream */ {
    locked: false,
    state: "readable",
    supportsBYOB: true,
  },
  bodyUsed: false,
  ok: false,
  redirected: false,
  type: "basic",
  url: "https://gatewayapi.com/rest/mtsms",
};
