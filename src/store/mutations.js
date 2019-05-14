export function REGISTER_CREDENTIALS (state, payload = {}) {
  if (!payload.token || !payload.account) {
    throw new Error(`Expected payload with properties: token, account. Got ${JSON.stringify(payload)}`)
  }
  const { token, account } = payload
  state.credentials = { token, account }
}

export function DESTROY_CREDENTIALS (state) {
  state.credentials = null
}
