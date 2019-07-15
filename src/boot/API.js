import axios from 'axios'
import { Notify, SessionStorage } from 'quasar'

const api = axios.create({
  baseURL: `https://${process.env.DEV ? 'chuturubi.com' : 'admin.guembebioparque.com'}/api/v1`,
  timeout: 1000,
  withCredentials: true
})

api.handleError = function handleError (error) {
  console.log(error.response)
  if (error.response && error.response.data) {
    Notify.create({
      message: error.response.data,
      color: 'negative',
      icon: 'mdi-alert-octagon'
    })
  } else {
    Notify.create({
      message: error.message,
      color: 'negative',
      icon: 'mdi-alert-octagon'
    })
  }
  throw error
}

api.interceptors.request.use(async request => {
  const sessionCookie = SessionStorage.getItem('session-auth')

  if (sessionCookie) {
    request.headers['Authorization'] = `session-auth ${sessionCookie}`
  }

  return request
}, async error => Promise.reject(error))

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
  constructor () {
    super('...args', 'return this.__call__(...args)')
    return this.bind(this)
  }

  async __call__ (query = '', variables = {}) {
    const { data: { data, errors } } = await api.post('/graphql', { query, variables })

    if (errors) {
      throw new GraphQLError({ query, variables, errors })
    }

    return data
  }

  handleError (error) {
    if (error instanceof GraphQLError) {
      error.display()
    } else {
      api.handleError(error)
    }
  }
}

const gql = new GraphQL()

export default ({ app, router, store, Vue }) => {
  Vue.prototype.$api = api
  Vue.prototype.$gql = gql
}

export {
  api,
  gql
}
