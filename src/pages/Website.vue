<template>
  <q-page padding>
    <q-table
      flat
      title="Sitio Web"
      :data="table.data"
      :columns="table.columns"
      row-key="page_id"
      :pagination.sync="table.pagination"
      :filter="table.filter"
      :loading="table.loading"
      @request="loadWebsite"
    >
      <template v-slot:top-right>
        <q-btn  color="accent" @click="showCreatePageDialog = true">
          Crear pagina nueva
        </q-btn>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-path="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            no-caps
            :label="`/${props.row.path}`"
            icon-right="mdi-open-in-new"
            @click="$router.push(`/website/test/${props.row.path}`)"
          />
          <q-tooltip>
            Ver o modificar pagina
          </q-tooltip>
        </q-td>
      </template>

      <template v-slot:body-cell-update="props">
        <q-td :props="props" auto-width class="">
          <q-btn
            no-wrap
            flat
            size="sm"
            label="Detalles"
            icon-right="mdi-open-in-new"
          />
          <q-tooltip>
            Ver o modificar pagina
          </q-tooltip>
        </q-td>
      </template>

    </q-table>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
    <dialog-window v-model="showCreatePageDialog">
      <template v-slot:title>
        Crear Pagina
      </template>
      <create-page />
    </dialog-window>
  </q-page>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
import CreatePage from 'components/CreatePage'
import { date } from 'quasar'
const { formatDate } = date

export default {
  name: 'Invoices',
  components: { DialogWindow, CreatePage },
  data () {
    return {
      loading: false,
      showCreatePageDialog: false,
      table: {
        loading: false,
        data: [],
        columns: [
          {
            name: 'name',
            field: 'name',
            label: 'Nombre'
          },
          {
            name: 'path',
            field: 'path',
            label: 'Ruta'
          },
          {
            name: 'created_at',
            label: 'Creado',
            align: 'left',
            field: 'created_at',
            format: (value, row) => formatDate(value, 'YYYY/MM/DD HH:mm')
          },
          {
            name: 'created_by',
            label: '',
            align: 'left',
            field: row => row.created_by_user ? row.created_by_user.username : null
          },
          {
            name: 'updated_at',
            label: 'Modificado',
            align: 'left',
            field: 'updated_at',
            format: (value, row) => formatDate(value, 'YYYY/MM/DD HH:mm')
          },
          {
            name: 'updated_by',
            label: '',
            align: 'left',
            field: row => row.updated_by_user ? row.updated_by_user.username : null
          },
          {
            name: 'view'
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
    async loadWebsite ({ pagination, filter = '' } = {}) {
      if (!pagination) {
        pagination = this.table.pagination
      }

      const query = /* GraphQL */`query ($where: website_page_bool_exp! $offset: Int! $limit: Int! $order_by: [website_page_order_by!]) {
        meta: website_page_aggregate (where: $where) {
          rows: aggregate {
            count
          }
        }
        data: website_page (where: $where offset: $offset limit: $limit order_by: $order_by) {
          page_id
          name
          path
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
        limit: pagination.rowsPerPage,
        offset: pagination.rowsPerPage * (pagination.page - 1),
        order_by: [
          { path: 'asc' }
        ],
        where: {
          _or: [
            { name: { _ilike: `%${filter}%` } },
            { path: { _ilike: `%${filter}%` } }
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
    this.loadWebsite()
  }
}
</script>
