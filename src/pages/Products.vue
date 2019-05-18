<template>
  <q-page>
    <q-btn @click="$router.push('/product')">
      Crear Producto nuevo
    </q-btn>
    <q-list>
      <q-item
        v-for="(product, index) in products"
        :key="index"
        clickable
        :to="`/product/${product.product_id}`"
      >
        <q-item-section>
          <q-item-label :lines="1">
            {{product.public_name}}
          </q-item-label>
          <q-item-label caption :lines="2">
            {{product.description}}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>

export default {
  name: 'Products',
  data () {
    return {
      products: [],
      loading: false
    }
  },
  methods: {
    async refreshData () {
      const query = /* GraphQL */`query {
        data: store_product (order_by: { created_at: desc }) {
          product_id
          private_name
          public_name
          description
        }
      }`

      const variables = {}

      try {
        this.loading = false

        const { data } = await this.$gql(query, variables, { role: 'administrator' })

        this.products = data
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
