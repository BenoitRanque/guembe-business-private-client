<template>
  <q-card style="width: 260px">
    <q-bar>
      Identificar Cliente
      <q-space />
      <q-btn flat dense icon="mdi-close" v-close-popup></q-btn>
    </q-bar>
    <q-form @submit="submit" @reset="reset" autofocus>
      <q-card-section>
        <q-input label="Codigo O Token Cliente" filled v-model="token" required></q-input>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="around">
        <!-- <q-btn color="secondary" flat type="reset">Restablecer</q-btn> -->
        <q-btn color="primary" type="submit">Identificar</q-btn>
      </q-card-actions>
    </q-form>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-card>
</template>

<script>
const CODE_REGEX = /^[0-9]+$/
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

export default {
  name: 'ClientIdentification',
  data () {
    return {
      loading: false,
      token: ''
    }
  },
  methods: {
    async submit () {
      const query = /* GraphQL */`query ($where: store_client_token_bool_exp!) {
        tokens: store_client_token (where: $where) {
          client_id
        }
      }`

      const variables = {}

      if (UUID_REGEX.test(this.token)) {
        variables.where = {
          token_id: {
            _eq: this.token
          }
        }
      } else if (CODE_REGEX.test(this.token)) {
        variables.where = {
          code: {
            _eq: Number(this.token)
          }
        }
      } else {
        this.$q.notify({ color: 'warning', icon: 'mdi-alert', message: `Formato de token invalido: ${this.token}` })
        this.reset()
        return
      }

      try {
        this.loading = true

        const { tokens: [ token ] } = await this.$gql(query, variables, { role: 'administrator' })

        if (token) {
          this.$router.push(`/client/${token.client_id}`)
        } else {
          this.$q.notify({ icon: 'mdi-alert', color: 'warning', message: `Token invalido o epxirado. Intente de nuevo` })
        }
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    },
    reset () {
      this.token = ''
    }
  }
}
</script>
