export async function authenticate ({ commit }, { username, password }) {
  const query = /* GraphQL */`query ($username: String! $password: String!) {
    credentials: staff_authentication (username: $username password: $password) {
      token
      account {
        user_id
        username
        roles
      }
    }
  }`

  const variables = {
    username,
    password
  }

  const { credentials } = await this.$router.app.$gql(query, variables)

  commit('REGISTER_CREDENTIALS', credentials)

  return credentials
}

export async function logout ({ commit }) {
  commit('DESTROY_CREDENTIALS')
}
