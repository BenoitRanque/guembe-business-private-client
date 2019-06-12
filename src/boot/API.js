import axios from 'axios'
import { Notify, SessionStorage } from 'quasar'

class GraphQLError {
  constructor ({ query, variables, errors }) {
    this.query = query
    this.variables = variables
    this.errors = errors

    if (process.env.DEV) {
      console.error(this)
    }
  }

  display () {
    this.errors.forEach(({ message }) => {
      Notify.create({
        message,
        color: 'negative',
        icon: 'mdi-alert-octagon'
      })
    })
  }
}

class GraphQL extends Function {
  constructor (api) {
    super('...args', 'return this.__call__(...args)')

    this.api = api

    return this.bind(this)
  }

  async __call__ (query = '', variables = {}) {
    const { data: { data, errors } } = await this.api.post('/graphql', { query, variables })

    if (errors) {
      throw new GraphQLError({ query, variables, errors })
    }

    return data
  }

  handleError (error) {
    console.log(error)
    if (error instanceof GraphQLError) {
      error.display()
    } else {
      throw error
    }
  }
}

const api = axios.create({
  baseURL: 'https://chuturubi.com/api/v1',
  timeout: 1000,
  withCredentials: true
})

api.interceptors.request.use(async request => {
  const sessionCookie = SessionStorage.getItem('session-auth')

  if (sessionCookie) {
    request.headers['Authorization'] = `session-auth ${sessionCookie}`
  }

  return request
}, async error => Promise.reject(error))

const gql = new GraphQL(api)

export default ({ app, router, store, Vue }) => {
  Vue.prototype.$api = api
  Vue.prototype.$gql = gql
}

export {
  api,
  gql
}
