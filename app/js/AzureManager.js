export function postRequest(url, data) {
  return fetch(url, {
    credentials: 'same-origin', // 'include', default: 'omit'
    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
    body: data, // Coordinate the body type with 'Content-Type'
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
  })
  .then(response => response.json())
}

export function postUploadFile(url, data) {
  return fetch(url, {
    credentials: 'same-origin', // 'include', default: 'omit'
    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
    body: data, // Coordinate the body type with 'Content-Type'
  })
  .then(response => response.json())
}
