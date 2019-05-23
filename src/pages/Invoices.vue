<template>
  <q-page padding>
    <q-table
      flat
      :title="client ? `Facturas: ${client.name}` : 'Facturas'"
      :data="table.data"
      :columns="table.columns"
      row-key="invoice_id"
      :pagination.sync="table.pagination"
      :filter="table.filter"
      :loading="table.loading"
      @request="loadInvoices"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-izi_link="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            label="Descargar"
            icon-right="mdi-download"
            type="a"
            :href="props.row.izi_link"
            download
          />
          <q-tooltip>
            Descargar Factura
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-client="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            label="Cliente"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/client/${props.row.purchase.client_id}`)"
          />
          <q-tooltip>
            Ver cliente
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
            Ver compra
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
            @click="$router.push(`/invoice/${props.row.invoice_id}`)"
          />
          <q-tooltip>
            Ver detalles de factura
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
  name: 'Invoices',
  props: {
    purchaseId: {
      type: String,
      required: false
    },
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
            name: 'izi_numero',
            label: 'Numero',
            field: 'izi_numero'
          },
          {
            name: 'izi_comprador',
            label: 'Comprador',
            field: 'izi_comprador'
          },
          {
            name: 'izi_razon_social',
            label: 'Razon Social',
            field: 'izi_razon_social'
          },
          {
            name: 'izi_autorizacion',
            label: 'Autorizacion',
            field: 'izi_autorizacion'
          },
          {
            name: 'izi_monto_total',
            label: 'Monto Total',
            field: 'izi_monto_total'
          },
          {
            name: 'izi_control',
            label: 'Control',
            field: 'izi_control'
          },
          {
            name: 'izi_link',
            label: 'Descargar Factura'
          },
          {
            name: 'client',
            label: 'Ver cliente'
          },
          {
            name: 'purchase',
            label: 'Ver compra'
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
    async loadInvoices ({ pagination, filter = '' } = {}) {
      if (!pagination) {
        pagination = this.table.pagination
      }

      const query = /* GraphQL */`query ($where: store_invoice_bool_exp! $offset: Int! $limit: Int! $order_by: [store_invoice_order_by!]) {
        meta: store_invoice_aggregate (where: $where) {
          rows: aggregate {
            count
          }
        }
        data: store_invoice (where: $where offset: $offset limit: $limit order_by: $order_by) {
          invoice_id
          created_at
          purchase_id
          purchase {
            client_id
          }
          izi_link
          izi_numero
          izi_comprador
          izi_razon_social
          izi_autorizacion
          izi_monto_total
          izi_control
        }
      }`

      const variables = {
        limit: pagination.rowsPerPage,
        offset: pagination.rowsPerPage * (pagination.page - 1),
        order_by: [
          { created_at: 'desc' }
        ],
        where: {
          purchase: {
            client_id: !this.clientId ? null : { _eq: this.clientId },
            purchase_id: !this.purchaseId ? null : { _eq: this.purchaseId }
          },
          _or: !filter ? [{}] : [
            { purchase: { client: { name: { _ilike: `%${filter}%` } } } }
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
    this.loadInvoices()
  }
}
</script>
