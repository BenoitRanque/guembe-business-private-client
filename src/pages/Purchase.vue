<template>
  <q-page padding>
    <pre>{{purchase}}</pre>
  </q-page>
</template>

<script>

export default {
  name: 'Purchase',
  props: {
    purchaseId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      purchase: null
    }
  },
  methods: {
    async loadPurchase () {
      const query = /* GraphQL */`query ($purchase_id: uuid!) {
        purchase: store_purchase_by_pk (purchase_id: $purchase_id) {
          purchase_id
          payment {
            status
            amount
          }
          purchase_listings {
            quantity
            listing {
              public_name
            }
          }
          purchased_products {
            product {
              public_name
            }
          }
        }
      }`

      const variables = {
        purchase_id: this.purchaseId
      }

      try {
        this.loading = true

        const { purchase } = await this.$gql(query, variables, { role: 'administrator' })

        this.purchase = purchase
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadPurchase()
  }
}
</script>
