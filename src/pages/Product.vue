<template>
  <q-page>
    <pre>{{product}}</pre>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'Product',
  props: {
    productId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      loading: false,
      product: null
    }
  },
  methods: {
    async loadData () {
      const query = /* GraphQL */`query ($product_id: uuid!) {
        data: webstore_product_by_pk (product_id: $product_id) {
          product_id
          name
          economic_activity {
            name
          }
          internal_product_id
          created_at
          created_by_user {
            username
          }
          updated_at
          updated_by_user {
            username
          }
        }
      }`

      const variables = {
        product_id: this.productId
      }

      try {
        this.loading = true

        const { data } = await this.$gql(query, variables, { role: 'administrator' })

        this.product = data
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
