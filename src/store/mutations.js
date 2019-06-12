export function LOGIN (state, session) {
  state.session = session
}

export function LOGOUT (state) {
  state.session = null
}

export function MESSAGE (state, payload) {
  state.message = payload
}
