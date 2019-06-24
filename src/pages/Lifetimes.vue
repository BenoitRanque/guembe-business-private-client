<template>
  <q-page padding>
    <q-btn  color="accent" @click="showCreateLifetimeDialog = true">
      Crear vigencia nueva
    </q-btn>
    <q-list>
      <q-item
        v-for="(lifetime, index) in lifetimes"
        :key="index"
        clickable
        :to="`/lifetime/${lifetime.lifetime_id}`"
      >
        <q-item-section>
          <q-item-label :lines="1">
            {{lifetime.public_name}}
          </q-item-label>
          <q-item-label caption :lines="2">
            {{lifetime.description}}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
    <dialog-window v-model="showCreateLifetimeDialog" title="Crear Vigencia">
      <create-lifetime></create-lifetime>
    </dialog-window>
  </q-page>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
import CreateLifetime from 'components/CreateLifetime'

export default {
  name: 'Lifetimes',
  components: { CreateLifetime, DialogWindow },
  data () {
    return {
      showCreateLifetimeDialog: false,
      lifetimes: [],
      loading: false
    }
  },
  methods: {
    async refreshData () {
      const query = /* GraphQL */`query {
        data: calendar_lifetime (order_by: { end: desc }) {
          lifetime_id
          name
        }
      }`

      const variables = {}

      try {
        this.loading = false

        const { data } = await this.$gql(query, variables, { role: 'administrator' })

        this.lifetimes = data
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.refreshData()
  }
}
</script>
