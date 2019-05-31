export function isAuthenticated (state) {
  return state.session !== null
}

export function userId (state, { isAuthenticated }) {
  if (!isAuthenticated) {
    return null
  }
  return state.session.user_id
}
