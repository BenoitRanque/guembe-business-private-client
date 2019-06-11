<template>
  <q-form @submit="submit" @reset="reset">
    <div class="q-gutter-md q-pa-md">

      <q-select
        v-model="element.size_id"
        :options="['xl', 'lg', 'md', 'sm', 'xs']"
      ></q-select>

    </div>
    <q-separator></q-separator>
    <div class="row justify-around q-pa-md">
      <q-btn color="secondary" flat type="reset">reset</q-btn>
      <q-btn color="primary" type="submit">Crear</q-btn>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-form>
</template>

<script>

export default {
  name: 'CreateElement',
  data () {
    return {
      loading: false,
      options: {
        economic_activity: []
      },
      element: {
        size_id: null
      }
    }
  },
  methods: {
    reset () {
      this.element.size_id = null
    },
    submit () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Este registro no puede modificicarse luego de la creacion',
        persistent: true,
        cancel: true
      }).onOk(this.createElement)
    },
    async createElement () {
      const query = /* GraphQL */`mutation ($objects: [website_element_insert_input!]!) {
        insert: insert_website_element (objects: $objects) {
          affected_rows
        }
      }`

      const variables = {
        objects: {
          ...this.element
        }
      }

      try {
        this.loading = true

        await this.$gql(query, variables, { role: 'administrator' })

        this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `Elemento Creado Exitosamente` })
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
