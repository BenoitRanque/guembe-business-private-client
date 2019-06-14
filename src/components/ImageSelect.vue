<template>
  <q-table
    flat
    title="Selecionar Imagen"
    :data="data"
    :columns="columns"
    row-key="image_id"
    :pagination.sync="pagination"
    :filter="filter"
    :loading="loading"
    @request="request"
  >
    <template v-slot:top-right>
      <slot name="upload"></slot>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
        <template v-slot:append>
          <q-icon name="mdi-magnify" />
        </template>
      </q-input>
    </template>

    <template v-slot:body-cell-preview="props">
      <q-td :props="props" auto-width class="">
        <q-avatar rounded color="grey-4">
          <q-img :src="$img.src(props.row.image_id, 'xs')" :placeholder="props.row.placeholder"></q-img>
        </q-avatar>
      </q-td>
    </template>

    <template v-slot:body-cell-select="props">
      <q-td :props="props">
        <q-btn flat dense icon="mdi-check" @click="select(props.row)"></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date

export default {
  name: 'ImageSelect',
  props: {
    format: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      filter: '',
      data: [],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0
      },
      columns: [
        {
          name: 'preview',
          label: 'Previsualizar',
          align: 'left'
        },
        {
          name: 'name',
          field: 'name',
          label: 'Nombre',
          align: 'left'
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
          align: 'left',
          label: 'Usuario',
          field: row => row.created_by_user ? row.created_by_user.username : null
        },
        {
          name: 'select',
          label: 'Selecionar'
        }
      ]
    }
  },
  methods: {
    formatDate,
    async request ({ pagination, filter = '' } = {}) {
      if (!pagination) {
        pagination = this.pagination
      }

      const query = /* GraphQL */`query ($where: website_image_bool_exp! $offset: Int! $limit: Int! $order_by: [website_image_order_by!]) {
        meta: website_image_aggregate (where: $where) {
          rows: aggregate {
            count
          }
        }
        data: website_image (where: $where offset: $offset limit: $limit order_by: $order_by) {
          image_id
          format_id
          name
          placeholder
          format {
            format_id
            name
            format_sizes {
              size_id
              width
            }
          }
          created_at
          created_by_user {
            username
          }
        }
      }`

      const variables = {
        limit: pagination.rowsPerPage,
        offset: pagination.rowsPerPage * (pagination.page - 1),
        order_by: [
          // todo: order by custom
          { created_at: 'desc' }
        ],
        where: {
          format_id: this.format ? { _eq: this.format } : null,
          name: !filter ? null : { _ilike: `%${filter}%` }
        }
      }

      try {
        this.loading = true

        const { data, meta: { rows: { count } } } = await this.$gql(query, variables, { role: 'administrator' })

        this.pagination = {
          ...pagination,
          rowsNumber: count
        }
        this.data = data
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    },
    select (row) {
      this.$emit('done', row.image_id)
    }
  },
  mounted () {
    this.request()
  }
}
</script>
