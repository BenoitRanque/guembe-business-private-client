<template>
  <q-page padding>
    <q-table
      title="Productos disponibles"
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
          <q-card :class="props.selected ? 'bg-grey-2' : ''" @click="props.selected = !props.selected">
            <q-card-section>
              <q-checkbox dense v-model="props.selected" :label="props.row.product.public_name" />
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
    <pre>{{table.pagination}}</pre>
    <pre>{{table.selected}}</pre>
    <pre>{{client}}</pre>
  </q-page>
</template>

<script>

export default {
  name: 'ClientProductUsable',
  props: {
    clientId: {
      type: String,
      required: true
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
            name: 'private_name',
            label: 'Nombre Privado',
            field: row => row.product.private_name,
            format: (value, row) => value
          },
          {
            name: 'public_name',
            label: 'Nombre publico',
            field: row => row.product.public_name,
            format: (value, row) => value
          },
          {
            name: 'description',
            label: 'Descripcion',
            field: row => row.product.description,
            format: (value, row) => value
          }
        ],
        rowsPerPageOptions: [3, 6, 9, 12, 0],
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
    async loadProducts ({ pagination } = {}) {
      if (!pagination) {
        pagination = this.table.pagination
      }

      const query = /* GraphQL */`query ($where: store_purchased_product_bool_exp! $offset: Int! $limit: Int! $order_by: [store_purchased_product_order_by!]) {
        meta: store_purchased_product_aggregate (where: $where) {
          rows: aggregate {
            count
          }
        }
        products: store_purchased_product (where: $where offset: $offset limit: $limit order_by: $order_by) {
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
      }`

      const variables = {
        limit: pagination.rowsPerPage,
        offset: pagination.rowsPerPage * (pagination.page - 1),
        order_by: null,
        // TODO add sorting
        // order_by: pagination.sortBy === null
        //   ? null
        //   : [ { [pagination.sortBy]: pagination.descending ? 'desc' : 'asc' } ],
        where: {
          purchased_product_usable: {},
          client_id: { _eq: this.clientId }
        }
      }

      try {
        this.table.loading = true

        const { products, meta: { rows: { count } } } = await this.$gql(query, variables, { role: 'administrator' })

        this.table.pagination.rowsNumber = count
        this.table.data = products
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
