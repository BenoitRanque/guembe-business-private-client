import { Cookies } from 'quasar'

export async function LOGIN ({ dispatch }, { username, password }) {
  const { data: session } = await this.$router.app.$api.post('/auth/login', { username, password })
  console.log(session)
  Cookies.set('session-auth', session)
  dispatch('RESTORE_SESSION')
}

export async function LOGOUT ({ commit }) {
  commit('LOGOUT')
}

export function RESTORE_SESSION ({ commit }) {
  const sessionCookie = Cookies.get('session-auth')

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
