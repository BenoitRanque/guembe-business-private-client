<template>
  <q-page padding>
    <q-table
      flat
      :title="client ? `Productos comprados: ${client.name}` : 'Productos Comprados'"
      :data="table.data"
      :columns="table.columns"
      row-key="purchased_product_id"
      :pagination.sync="table.pagination"
      :filter="table.filter"
      :loading="table.loading"
      @request="loadPurchasedProducts"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-client="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            :label="props.row.client.name"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/client/${props.row.client.client_id}`)"
          />
          <q-tooltip>
            Ver detalles de cliente
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-product="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            :label="props.row.product.public_name"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/product/${props.row.product.product_id}`)"
          />
          <q-tooltip>
            Ver detalles de producto
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-listing="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            :label="props.row.listing.public_name"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/listing/${props.row.listing.listing_id}`)"
          />
          <q-tooltip>
            Ver detalles de paquete
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-purchase="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            label="Compra"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/purchase/${props.row.purchase_id}`)"
          />
          <q-tooltip>
            Ver detalles de compra
          </q-tooltip>
        </q-td>
      </template>
    </q-table>
    <pre>{{table.data}}</pre>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'PurchasedProducts',
  props: {
    clientId: {
      type: String,
      required: false
    },
    purchaseId: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      loading: false,
      client: null,
      table: {
        loading: false,
        data: [],
        columns: [
          {
            name: 'client',
            label: 'Cliente',
            align: 'left'
          },
          {
            name: 'product',
            label: 'Producto',
            align: 'left'
          },
          {
            name: 'listing',
            label: 'Paquete',
            align: 'left'
          },
          {
            name: 'purchase',
            label: 'Compra'
          }
        ],
        pagination: {
          sortBy: null,
          descending: false,
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        },
        filter: ''
      }
    }
  },
  methods: {
    async loadPurchasedProducts ({ pagination, filter = '' } = {}) {
      if (!pagination) {
        pagination = this.table.pagination
      }

      const query = /* GraphQL */`query ($where: store_purchased_product_bool_exp! $offset: Int! $limit: Int! $order_by: [store_purchased_product_order_by!]) {
        meta: store_purchased_product_aggregate (where: $where) {
          rows: aggregate {
            count
          }
        }
        data: store_purchased_product (where: $where offset: $offset limit: $limit order_by: $order_by) {
          purchase_id
          created_at
          client {
            client_id
            name
          }
          product {
            product_id
            public_name
          }
          listing {
            listing_id
            public_name
          }
          purchase {
            purchase_id
          }
        }
      }`

      const variables = {
        limit: pagination.rowsPerPage,
        offset: pagination.rowsPerPage * (pagination.page - 1),
        order_by: [
          { created_at: 'desc' }
        ],
        where: {
          client_id: !this.clientId ? null : { _eq: this.clientId },
          _or: !filter ? [{}] : [
            { client: !filter ? null : { name: { _ilike: `%${filter}%` } } },
            { purchase_listings: { listing: { public_name: { _ilike: `%${filter}%` } } } },
            { purchase_listings: { listing: { description: { _ilike: `%${filter}%` } } } },
            { purchase_listings: { listing: { listing_products: { product: { public_name: { _ilike: `%${filter}%` } } } } } },
            { purchase_listings: { listing: { listing_products: { product: { description: { _ilike: `%${filter}%` } } } } } }
          ]
        }
      }

      try {
        this.table.loading = true

        const { data, meta: { rows: { count } } } = await this.$gql(query, variables, { role: 'administrator' })

        this.table.pagination = {
          ...pagination,
          rowsNumber: count
        }
        this.table.data = data
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.table.loading = false
      }
    },
    async loadClient () {
      if (!this.clientId) {
        return
      }

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
    this.loadPurchasedProducts()
  }
}
</script>
