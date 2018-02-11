import qs from 'qs'
import config from './config'

function json(response) {
  if(!response.ok) {
    return response.json().then(error => Promise.reject(error))
  }
  return response.json()
}

function defaults(method, body) {
  const defaults = {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  }
  if(body) defaults.body = JSON.stringify(body)
  return defaults
}

const queryOptions =  {encode: false, arrayFormat: 'brackets' }

function query(url, query) {
  var [root, search] = url.split('?')
  query = Object.assign(auth(), query)
  if(!config.authUrl.match(/^http[s]?\:\/\//)) {
    root = config.authUrl + root
  }
  if(search) query = Object.assign(qs.parse(search), query)
  return [root, qs.stringify(query, queryOptions)].join('?')
}

function request(method) {
  return function fetchMethod(url, search, body) {
    if(!body) return fetchMethod(url, null, search)
    return fetch(query(url, search), defaults(method, body)).then(json)
  }
}

fetch.get = (url, search) => {
  return fetch(query(url, search), defaults('GET')).then(json)
}
fetch.put = request('PUT')
fetch.post = request('POST')
fetch.patch = request('PATCH')
fetch.delete = request('DELETE')

module.exports = fetch
