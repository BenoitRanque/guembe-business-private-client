<template>
  <q-page padding>
    <q-table
      flat
      title="Clientes"
      :data="table.data"
      :columns="table.columns"
      row-key="client_id"
      :pagination.sync="table.pagination"
      :filter="table.filter"
      :loading="table.loading"
      @request="loadClients"
    >
      <template v-slot:top-right>
        <q-btn color="accent" class="q-mx-sm" @click="showClientIdentificationDialog = true">Identificar cliente</q-btn>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-purchases="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            label="Compras"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/client/${props.row.client_id}/purchases`)"
          />
          <q-tooltip>
            Ver compras
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-purchased_products="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            label="Productos Comprados"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/client/${props.row.client_id}/purchasedproducts`)"
          />
          <q-tooltip>
            Ver productos comprados
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-purchased_products_use="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            label="Uso de Productos"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/client/${props.row.client_id}/purchasedproducts/use`)"
          />
          <q-tooltip>
            Ver uso de productos
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
            @click="$router.push(`/client/${props.row.client_id}`)"
          />
          <q-tooltip>
            Ver detalles de cliente
          </q-tooltip>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showClientIdentificationDialog" persistent>
      <client-identification></client-identification>
    </q-dialog>
  </q-page>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date

import ClientIdentification from 'components/ClientIdentification'

export default {
  name: 'Clients',
  components: { ClientIdentification },
  data () {
    return {
      showClientIdentificationDialog: false,
      loading: false,
      clients: [],
      table: {
        loading: false,
        data: [],
        columns: [
          {
            name: 'name',
            label: 'Nombre',
            align: 'left',
            field: row => row.name,
            format: (value, row) => value
          },
          {
            name: 'created_at',
            label: 'Fecha Hora',
            align: 'left',
            field: 'created_at',
            format: (value, row) => formatDate(value, 'YYYY/MM/DD HH:mm')
          },
          {
            name: 'purchases',
            label: 'Compras',
            align: 'center'
          },
          {
            name: 'purchased_products',
            label: 'Productos Comprados',
            align: 'center'
          },
          {
            name: 'purchased_products_use',
            label: 'Uso de Productos',
            align: 'center'
          },
          {
            name: 'details',
            label: 'Detalles'
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
    async loadClients ({ pagination, filter = '' } = {}) {
      if (!pagination) {
        pagination = this.table.pagination
      }

      const query = /* GraphQL */`query ($where: store_client_bool_exp! $offset: Int! $limit: Int! $order_by: [store_client_order_by!]) {
        meta: store_client_aggregate (where: $where) {
          rows: aggregate {
            count
          }
        }
        data: store_client (where: $where offset: $offset limit: $limit order_by: $order_by) {
          client_id
          created_at
          name
        }
      }`

      const variables = {
        limit: pagination.rowsPerPage,
        offset: pagination.rowsPerPage * (pagination.page - 1),
        order_by: [
          { created_at: 'desc' }
        ],
        where: {
          _or: !filter ? [{}] : [
            { name: { _ilike: `%${filter}%` } }
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
    }
  },
  mounted () {
    this.loadClients()
  }
}
</script>
