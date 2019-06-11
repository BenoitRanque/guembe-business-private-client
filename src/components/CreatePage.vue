<template>
  <q-form @submit="submit" @reset="reset">
    <div class="q-gutter-md q-pa-md">

      <q-input
        filled
        required
        label="Nombre"
        hint="Nombre de uso interno"
        v-model="page.name"
        lazy-rules
        :rules="[
        ]"
      ></q-input>
      <q-input
        filled
        prefix="/"
        label="Ruta"
        hint="Ruta donde se encontrara la pagina. Debe ser unica"
        v-model="page.path"
        lazy-rules
        :rules="[
          value => /^([\w-]+(\/[\w-]+)*)?$/.test(value) ? true : 'Ruta invalida.'
        ]"
      ></q-input>

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
  name: 'CreatePage',
  data () {
    return {
      loading: false,
      options: {
        economic_activity: []
      },
      page: {
        name: '',
        path: ''
      }
    }
  },
  methods: {
    reset () {
      this.page.name = ''
      this.page.path = ''
    },
    submit () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Este registro no puede modificicarse luego de la creacion',
        persistent: true,
        cancel: true
      }).onOk(this.createPage)
    },
    async createPage () {
      const query = /* GraphQL */`mutation ($objects: [website_page_insert_input!]!) {
        insert: insert_website_page (objects: $objects) {
          affected_rows
          page: returning {
            id: page_id
            name
            path
          }
        }
      }`

      const variables = {
        objects: {
          ...this.page
        }
      }

      try {
        this.loading = true

        const { insert: { page: [ { name, path } ] } } = await this.$gql(query, variables, { role: 'administrator' })

        this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `Pagina ${name} Creada Exitosamente` })
        this.$router.push(`/website/${path}`)
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
