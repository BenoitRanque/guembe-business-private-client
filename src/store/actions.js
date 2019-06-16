import { SessionStorage } from 'quasar'
import { gql } from 'src/boot/api'

export async function LOGIN ({ dispatch }, { username, password }) {
  const { data: session } = await this.$router.app.$api.post('/auth/login', { username, password })
  SessionStorage.set('session-auth', session)
  dispatch('RESTORE_SESSION')

  dispatch('INIT_STORE')
}

export async function LOGOUT ({ commit }) {
  await this.$router.app.$api.post('/auth/logout')
  SessionStorage.remove('session-auth')
  commit('LOGOUT')
}

export function RESTORE_SESSION ({ commit }) {
  const sessionCookie = SessionStorage.getItem('session-auth')

  if (!sessionCookie) {
    return
  }

  const token = sessionCookie.split('.')[1]

  if (!token) {
    throw new Error('Unexpected format for session cookie')
  }

  const session = JSON.parse(atob(token))

  commit('LOGIN', session.ses)
}

export async function INIT_STORE ({ dispatch }) {
  try {
    await dispatch('website/INITIALIZE_WEBSITE_STORE')
  } catch (error) {
    gql.handleError(error)
  }
}
