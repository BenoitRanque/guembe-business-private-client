<template>
  <q-page padding>
    <q-table
      flat
      :title="client ? `Compras: ${client.name}` : 'Compras'"
      :data="table.data"
      :columns="table.columns"
      row-key="purchase_id"
      :pagination.sync="table.pagination"
      :filter="table.filter"
      :loading="table.loading"
      @request="loadPurchases"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-invoices="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            :label="`${props.row.invoices_aggregate.aggregate.count} Factura${props.row.invoices_aggregate.aggregate.count > 1 ? 's' : ''}`"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/purchase/${props.row.purchase_id}/invoices`)"
          />
          <q-tooltip>
            Ver Facturas
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-purchased_products="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            :label="`${props.row.purchased_products.aggregate.count} Producto${props.row.purchased_products.aggregate.count > 1 ? 's' : ''} (${props.row.used_purchased_products.aggregate.count}/${props.row.unused_purchased_products.aggregate.count})`"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/purchase/${props.row.purchase_id}/purchasedproducts`)"
          />
          <q-tooltip>
            Ver {{props.row.purchased_products.aggregate.count}} Producto{{props.row.purchased_products.aggregate.count > 1 ? 's' : ''}}
            ({{props.row.used_purchased_products.aggregate.count}} utilizados / {{props.row.unused_purchased_products.aggregate.count}} no utilizados)
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-details="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            label="Detalles"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/purchase/${props.row.purchase_id}`)"
          />
          <q-tooltip>
            Ver detalles de compra
          </q-tooltip>
        </q-td>
      </template>

    </q-table>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date

export default {
  name: 'Purchases',
  props: {
    clientId: {
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
            name: 'created_at',
            label: 'Fecha Hora',
            align: 'left',
            field: 'created_at',
            format: (value, row) => formatDate(value, 'YYYY/MM/DD HH:mm')
          },
          {
            name: 'client_name',
            label: 'Cliente',
            align: 'left',
            field: row => row.client.name,
            format: (value, row) => value
          },
          {
            name: 'payment_status',
            label: 'Estado Pago',
            align: 'left',
            field: row => row.payment.status,
            format: (value, row) => value
          },
          {
            name: 'payment_amount',
            label: 'Monto Pago',
            align: 'left',
            field: row => row.payment.amount,
            format: (value, row) => `Bs ${(Number(value) / 100).toFixed(2)}`
          },
          {
            name: 'invoices',
            label: 'Facturas',
            align: 'left',
            field: row => row.invoices_aggregate.aggregate.count,
            format: (value, row) => value
          },
          {
            name: 'purchased_products',
            label: 'Productos Comprados',
            align: 'left',
            field: row => row.purchased_products.aggregate.count,
            format: (value, row) => value
          },
          {
            name: 'details',
            label: 'Ver detalles'
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
    async loadPurchases ({ pagination, filter = '' } = {}) {
      if (!pagination) {
        pagination = this.table.pagination
      }

      const query = /* GraphQL */`query ($where: store_purchase_bool_exp! $offset: Int! $limit: Int! $order_by: [store_purchase_order_by!]) {
        meta: store_purchase_aggregate (where: $where) {
          rows: aggregate {
            count
          }
        }
        data: store_purchase (where: $where offset: $offset limit: $limit order_by: $order_by) {
          purchase_id
          created_at
          client {
            client_id
            name
          }
          payment {
            status
            amount
            updated_at
          }
          invoices_aggregate {
            aggregate {
              count
            }
          }
          purchased_products: purchased_products_aggregate {
            aggregate {
              count
            }
          }
          used_purchased_products: purchased_products_aggregate (where: {
            purchased_product_uses: {
              cancelled: {
                _eq: false
              }
            }
          }) {
            aggregate {
              count
            }
          }
          unused_purchased_products: purchased_products_aggregate (where: {
            _not: {
              purchased_product_uses: {
                cancelled: {
                  _eq: false
                }
              }
            }
          }) {
            aggregate {
              count
            }
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
            { client: { name: { _ilike: `%${filter}%` } } },
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
    this.loadPurchases()
  }
}
</script>
