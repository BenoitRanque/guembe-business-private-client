export function isAuthenticated (state) {
  return state.credentials !== null
}

export function userId (state, { isAuthenticated }) {
  if (!isAuthenticated) {
    return null
  }
  return state.credentials.account.user_id
}
