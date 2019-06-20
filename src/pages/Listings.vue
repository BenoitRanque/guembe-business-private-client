<template>
  <q-page>
    <q-btn @click="showCreateListingDialog = true">
      Crear paquete nuevo
    </q-btn>
    <q-list>
      <q-item
        v-for="(listing, index) in listings"
        :key="index"
        clickable
        :to="`/listing/${listing.listing_id}`"
      >
        <q-item-section>
          <q-item-label :lines="1">
            {{listing.public_name}}
          </q-item-label>
          <q-item-label caption :lines="2">
            {{listing.description}}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>

    <dialog-window v-model="showCreateListingDialog" title="Crear Paquete">
      <create-listing></create-listing>
    </dialog-window>
  </q-page>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
import CreateListing from 'components/CreateListing'

export default {
  name: 'Listings',
  components: { DialogWindow, CreateListing },
  data () {
    return {
      showCreateListingDialog: false,
      listings: [],
      loading: false
    }
  },
  methods: {
    async refreshData () {
      const query = /* GraphQL */`query {
        data: store_listing (order_by: { created_at: desc }) {
          listing_id
          private_name
          public_name
          description
        }
      }`

      const variables = {}

      try {
        this.loading = false

        const { data } = await this.$gql(query, variables, { role: 'administrator' })

        this.listings = data
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
