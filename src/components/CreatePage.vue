<template>
  <q-form @submit="submit" @reset="reset" class="q-pa-md">
    <div class="q-gutter-y-md">

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

      <image-input filled v-model="page.image_id" format="background" label="Imagen de Fondo"></image-input>

    </div>
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
import ImageInput from 'components/ImageInput'

export default {
  name: 'CreatePage',
  components: { ImageInput },
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
      try {
        this.loading = true

        const { insert: { page: [ page ] } } = await this.$store.dispatch('website/CREATE_PAGE', this.page)

        this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `Pagina ${page.name} Creada Exitosamente` })
        this.$emit('done', page)
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
