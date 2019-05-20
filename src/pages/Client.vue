<template>
  <q-page padding>
    <q-btn @click="$router.push(`/client/${clientId}/products/usable`)">Ver Productos utilizables</q-btn>
    <pre>{{client}}</pre>
  </q-page>
</template>

<script>

export default {
  name: 'Client',
  props: {
    clientId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      client: null
    }
  },
  methods: {
    async loadClient () {
      const query = /* GraphQL */`query ($client_id: uuid!) {
        client: store_client_by_pk (client_id: $client_id) {
          client_id
          name
        }
      }`

      const variables = {
        client_id: this.clientId
      }

      try {
        this.loading = true

        const { client } = await this.$gql(query, variables, { role: 'administrator' })

        this.client = client
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadClient()
  }
}
</script>
