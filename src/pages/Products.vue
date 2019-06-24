<template>
  <q-page>
    <q-btn @click="showCreateProductDialog = true">
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
            {{product.name}}
          </q-item-label>
          <!-- <q-item-label caption :lines="2">
            {{product.description}}
          </q-item-label> -->
        </q-item-section>
      </q-item>
    </q-list>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>

    <dialog-window v-model="showCreateProductDialog" title="Crear Producto">
      <create-product></create-product>
    </dialog-window>
  </q-page>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
import CreateProduct from 'components/CreateProduct'

export default {
  name: 'Products',
  components: { DialogWindow, CreateProduct },
  data () {
    return {
      showCreateProductDialog: false,
      products: [],
      loading: false
    }
  },
  methods: {
    async refreshData () {
      const query = /* GraphQL */`query {
        data: webstore_product (order_by: { created_at: desc }) {
          product_id
          name
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
