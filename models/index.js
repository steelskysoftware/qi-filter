export {Guest} from './guest'
export {Video} from './video'
import config from '../config'
console.log(process.env)

export function model(className) {
  return function define(Class) {
    Object.assign(Class, {
      load() {
        return fetch(`${process.env.baseUrl}/api/${Class.endpoint}`)
          .then(res => res.json())
          .then(data => {
            Object.keys(data).forEach(k => {
              data[k] = data[k].map(d => Object.assign(new Class(), d))
            })
            return data
          })
      },
    })
  }
}

export function endpoint(path) {
  return function(Class) {
    Object.assign(Class, {
      endpoint: path
    })
  }
}
