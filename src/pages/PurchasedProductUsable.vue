<template>
  <q-page padding>
    <q-table
      :title="`Productos vigentes: ${client.name}`"
      :selected-rows-label="count => `${count} producto${count === 1 ? '' : 's'} seleccionado${count === 1 ? '' : 's'}`"
      :data="table.data"
      :columns="table.columns"
      row-key="purchased_product_id"
      selection="multiple"
      :selected.sync="table.selected"
      :pagination.sync="table.pagination"
      :filter="table.filter"
      :loading="table.loading"
      :rows-per-page-options="table.rowsPerPageOptions"
      @request="loadProducts"
      grid
    >
      <template v-slot:top-right>
        <q-btn @click="useProducts" color="accent" class="q-mx-sm" :disable="!table.selected.length">Canjear productos</q-btn>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-green-4' : 'bg-green-2'" @click="props.selected = !props.selected">
            <q-card-section>
              <!-- <q-checkbox dense v-model="props.selected" :label="props.row.product.public_name" /> -->
              <q-checkbox dense v-model="props.selected">
                <div class="text-h6">{{props.row.product.public_name}}</div>
              </q-checkbox>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-body2">
              {{props.row.product.private_name}}
            </q-card-section>
            <q-card-section class="text-caption">
              {{props.row.product.description}}
            </q-card-section>
            <q-card-section class="text-caption">
              <lifetime :lifetime="props.row.lifetime" />
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
    <!-- <pre>{{table.pagination}}</pre> -->
    <!-- <pre>{{table.selected}}</pre> -->
    <!-- <pre>{{client}}</pre> -->
  </q-page>
</template>

<script>
import Lifetime from 'components/Lifetime'

export default {
  name: 'ClientProductUsable',
  components: { Lifetime },
  props: {
    clientId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      client: {},
      table: {
        loading: false,
        data: [],
        columns: [
          // {
          //   name: 'private_name',
          //   label: 'Nombre Privado',
          //   field: row => row.product.private_name,
          //   format: (value, row) => value
          // },
          // {
          //   name: 'public_name',
          //   label: 'Nombre publico',
          //   field: row => row.product.public_name,
          //   format: (value, row) => value
          // },
          // {
          //   name: 'description',
          //   label: 'Descripcion',
          //   field: row => row.product.description,
          //   format: (value, row) => value
          // }
        ],
        rowsPerPageOptions: [3, 4, 6, 8, 9, 12, 15, 16, 18, 20, 24],
        selected: [],
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
    useProducts () {
      if (!this.table.selected.length) {
        this.$q.notify({ icon: 'mdi-alert', color: 'warning', message: 'Debe selecionar por lo menos 1 producto para canjear' })
        return
      }

      this.$q.dialog({
        title: 'Canjear Productos',
        message: `Desea registrar el canje de ${this.table.selected.length} productos?`,
        ok: {
          color: 'primary'
        },
        cancel: true
      }).onOk(async () => {
        const query = /* GraphQL */`mutation ($objects: [store_purchased_product_use_insert_input!]!) {
          insert: insert_store_purchased_product_use (objects: $objects) {
            count: affected_rows
          }
        }`

        const variables = {
          objects: this.table.selected.map(({ purchased_product_id }) => ({ purchased_product_id }))
        }

        try {
          this.loading = true

          const { insert: { count } } = await this.$gql(query, variables, { role: 'administrator' })

          this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `${count} producto${count > 1 ? 's' : ''} canjeado${count > 1 ? 's' : ''}` })

          this.table.selected = []
        } catch (error) {
          this.$gql.handleError(error)
        } finally {
          this.loading = false
          this.loadProducts()
        }
      })
    },
    async loadProducts ({ pagination, filter = '' } = {}) {
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
          purchased_product_id
          product {
            private_name
            public_name
            description
          }
          lifetime {
            include_holidays
            start
            end
            lifetime_weekdays {
              weekday_id
            }
          }
        }
      }`

      const variables = {
        limit: pagination.rowsPerPage,
        offset: pagination.rowsPerPage * (pagination.page - 1),
        order_by: [
          { lifetime: { end: 'asc' } },
          { product: { public_name: 'asc' } }
        ],
        where: {
          purchased_product_usable: {},
          client_id: { _eq: this.clientId },
          product: !filter ? null : {
            _or: [
              { private_name: { _ilike: `%${filter}%` } },
              { public_name: { _ilike: `%${filter}%` } },
              { description: { _ilike: `%${filter}%` } }
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
    this.loadProducts()
    this.loadClient()
  }
}
</script>
