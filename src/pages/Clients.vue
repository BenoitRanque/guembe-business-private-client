<template>
  <q-page padding>
    <q-list>
      <q-item v-for="(client, index) in clients" :key="index" :to="`/client/${client.client_id}`">
        <q-item-section>
          {{client.name}}
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>

export default {
  name: 'Clients',
  data () {
    return {
      loading: false,
      clients: []
    }
  },
  methods: {
    async loadClients () {
      const query = /* GraphQL */`query {
        clients: store_client {
          client_id
          name
        }
      }`

      const variables = {}

      try {
        this.loading = true

        const { clients } = await this.$gql(query, variables, { role: 'administrator' })

        this.clients = clients
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadClients()
  }
}
</script>
