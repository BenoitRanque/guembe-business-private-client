<template>
  <q-page padding class="">
    <q-form @submit="submit" @reset="reset" autofocus class="q-gutter-md" style="max-width: 600px">
      <q-input
        filled
        label="Nombre Privado"
        hint="Nombre de uso interno"
        v-model="product.private_name"
        lazy-rules
        :rules="[
          value => value && value.length > 0 ? true : 'Campo Obligatorio'
        ]"
      ></q-input>
      <q-input
        filled
        label="Nombre Publico"
        hint="Nombre de uso publico"
        v-model="product.public_name"
        lazy-rules
        :rules="[
          value => value && value.length > 0 ? true : 'Campo Obligatorio'
        ]"
      ></q-input>
      <q-input
        filled
        type="textarea"
        label="Descripcion"
        hint="Descripcion detallada. Uso publico & interno"
        v-model="product.description"
        lazy-rules
        :rules="[
          value => value && value.length > 0 ? true : 'Campo Obligatorio'
        ]"
      ></q-input>
      <q-input
        filled
        label="Codigo de uso Interno"
        hint="Codigo interno del producto"
        v-model="product.internal_product_id"
        lazy-rules
        :rules="[]"
      ></q-input>
      <q-select
        filled
        label="Actividad Economica"
        hint="Rubro del producto"
        v-model="product.economic_activity_id"
        :options="options.economic_activity"
        lazy-rules
        :rules="[
          value => value !== null ? true : 'Campo Obligatorio'
        ]"
      ></q-select>

      <q-btn color="primary" type="submit">submit</q-btn>
      <q-btn color="secondary" flat type="reset">reset</q-btn>
      <q-inner-loading :showing="loading">
        <q-spinner></q-spinner>
      </q-inner-loading>
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'CreateProduct',
  data () {
    return {
      loading: false,
      options: {
        economic_activity: []
      },
      product: {
        public_name: '',
        private_name: '',
        description: '',
        economic_activity_id: null,
        internal_product_id: null
      }
    }
  },
  methods: {
    reset () {
      this.product.public_name = ''
      this.product.private_name = ''
      this.product.description = ''
      this.product.economic_activity_id = null
      this.product.internal_product_id = null
    },
    submit () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Este registro no puede modificicarse luego de la creacion',
        persistent: true,
        cancel: true
      }).onOk(this.createProduct)
    },
    async createProduct () {
      const query = /* GraphQL */`mutation ($objects: [store_product_insert_input!]!) {
        insert: insert_store_product (objects: $objects) {
          affected_rows
          products: returning {
            id: product_id
            name: private_name
          }
        }
      }`

      const variables = {
        objects: {
          ...this.product,
          economic_activity_id: this.product.economic_activity_id.value
        }
      }

      try {
        this.loading = true

        const { insert: { products: [ { id, name } ] } } = await this.$gql(query, variables, { role: 'administrator' })

        this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `Producto ${name} Creado Exitosamente` })
        this.$router.push(`/product/${id}`)
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    },
    async loadOptions () {
      const query = /* GraphQL */`query {
        economic_activity: store_economic_activity {
          value: economic_activity_id
          label: description
        }
      }`
      const variables = {}

      try {
        this.loading = true

        const { economic_activity } = await this.$gql(query, variables, { role: 'administrator' })

        this.options.economic_activity = economic_activity
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadOptions()
  }
}
</script>
