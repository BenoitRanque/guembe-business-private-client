<template>
  <q-page padding>
    <q-table
      flat
      :title="client ? `Uso de productos: ${client.name}` : 'Uso de productos'"
      :data="table.data"
      :columns="table.columns"
      row-key="purchased_product_use_id"
      :pagination.sync="table.pagination"
      :filter="table.filter"
      :loading="table.loading"
      :rows-per-page-options="table.rowsPerPageOptions"
      @request="loadPurchasedProductUse"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-cancel="props">
        <q-td :props="props" auto-width>
          <q-btn
            v-if="!props.row.cancelled"
            @click="cancelPurchasedProductUse(props.row.purchased_product_use_id)"
            :disable="props.row.cancelled"
            label="Cancelar"
            size="sm"
            dense
            color="negative"
            outline
          />
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
  name: 'PurchasedProductUse',
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
            name: 'client_name',
            label: 'Cliente',
            align: 'left',
            field: row => row.purchased_product.client.name,
            format: (value, row) => value
          },
          {
            name: 'product_private_name',
            label: 'Producto',
            align: 'left',
            field: row => row.purchased_product.product.public_name,
            format: (value, row) => value
          },
          {
            name: 'created_at',
            label: 'Creado',
            align: 'left',
            field: row => row.created_at,
            format: (value, row) => formatDate(value, 'YYYY/MM/DD HH:mm')
          },
          {
            name: 'created_by_user',
            label: 'Creado Por',
            align: 'left',
            field: row => row.created_by_user.username,
            format: (value, row) => value
          },
          {
            name: 'cancelled',
            label: 'Cancellado',
            align: 'left',
            field: row => row.cancelled,
            format: (value, row) => value ? 'Si' : 'No'
          },
          {
            name: 'cancelled_motive',
            label: 'Motivo',
            align: 'left',
            field: row => row.cancelled_motive,
            format: (value, row) => value
          },
          {
            name: 'updated_at',
            label: 'Actualizado',
            align: 'left',
            field: row => row.updated_at,
            format: (value, row) => formatDate(value, 'YYYY/MM/DD HH:mm')
          },
          {
            name: 'updated_by_user',
            label: 'Actualizado por',
            align: 'left',
            field: row => row.updated_by_user.username,
            format: (value, row) => value
          },
          {
            name: 'cancel',
            label: 'Cancelar'
          }
        ],
        rowsPerPageOptions: [3, 4, 6, 8, 9, 12, 15, 16, 18, 20, 24],
        pagination: {
          sortBy: null,
          descending: false,
          page: 1,
          rowsPerPage: 6,
          rowsNumber: 0
        },
        filter: ''
      }
    }
  },
  methods: {
    cancelPurchasedProductUse (productUseId) {
      this.$q.dialog({
        title: 'Cancelar uso de producto',
        message: 'Esta accion es irreversible. Una vez anulado el uso, el producto podra ser utilizado de nuevo. Para continuar, ingrese el motivo de la cancelacion y aprete "OK"',
        prompt: {
          model: '',
          type: 'text'
        },
        cancel: true,
        persistent: true
      }).onOk(async cancelled_motive => {
        if (!cancelled_motive) {
          this.$q.notify({ color: 'warning', icon: 'mdi-alert', message: 'Debe ingresar un motivo para cancelar el uso' })
          return
        }

        const query = /* GraphQL */`mutation ($where: store_purchased_product_use_bool_exp! $_set: store_purchased_product_use_set_input) {
          updated: update_store_purchased_product_use (where: $where _set: $_set) {
            count: affected_rows
          }
        }`

        const variables = {
          where: {
            purchased_product_use_id: {
              _eq: productUseId
            }
          },
          _set: {
            cancelled_motive
          }
        }

        try {
          this.loading = true

          const { updated: { count } } = await this.$gql(query, variables, { role: 'administrator' })

          this.$q.notify({ color: 'positive', icon: 'mdi-check', message: `${count} uso de producto cancellado` })
        } catch (error) {
          this.$gql.handleError(error)
        } finally {
          this.loading = false
          this.loadPurchasedProductUse()
        }
      })
    },
    async loadPurchasedProductUse ({ pagination, filter = '' } = {}) {
      if (!pagination) {
        pagination = this.table.pagination
      }

      const query = /* GraphQL */`query ($where: store_purchased_product_use_bool_exp! $offset: Int! $limit: Int! $order_by: [store_purchased_product_use_order_by!]) {
        meta: store_purchased_product_use_aggregate (where: $where) {
          rows: aggregate {
            count
          }
        }
        data: store_purchased_product_use (where: $where offset: $offset limit: $limit order_by: $order_by) {
          purchased_product_use_id
          created_at
          created_by_user {
            user_id
            username
          }
          cancelled
          cancelled_motive
          updated_at
          updated_by_user {
            user_id
            username
          }
          purchased_product {
            client {
              name
            }
            purchased_product_id
            product {
              private_name
              public_name
              description
            }
            lifetime {
              start
              end
            }
          }
        }
      }`

      const variables = {
        limit: pagination.rowsPerPage,
        offset: pagination.rowsPerPage * (pagination.page - 1),
        order_by: [
          { created_at: 'desc' },
          { updated_at: 'desc' }
        ],
        where: {
          purchased_product: {
            client_id: !this.clientId ? null : { _eq: this.clientId },
            _or: !filter ? [{}] : [
              { product: { private_name: { _ilike: `%${filter}%` } } },
              { product: { public_name: { _ilike: `%${filter}%` } } },
              { product: { description: { _ilike: `%${filter}%` } } },
              { client: { name: { _ilike: `%${filter}%` } } }
            ]
          }
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
    this.loadPurchasedProductUse()
  }
}
</script>
