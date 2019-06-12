<template>
  <q-bar>
    <q-btn-group flat>
      <q-btn flat size="sm" dense icon="mdi-pencil">
        <q-tooltip>
          Editar Contenido
        </q-tooltip>
      </q-btn>
      <q-btn @click="decreaseSize" size="sm" flat icon="mdi-chevron-triple-down" dense>
        <q-tooltip>
          Disminuir tamaño
        </q-tooltip>
      </q-btn>
      <q-btn @click="increaseSize" size="sm" flat icon="mdi-chevron-triple-up" dense>
        <q-tooltip>
          Aumentar tamaño
        </q-tooltip>
      </q-btn>
    </q-btn-group>
    <q-space />
    <q-btn size="sm" flat dense icon="mdi-delete">
      <q-tooltip>
        Eliminar elemento
      </q-tooltip>
    </q-btn>
    <dialog-window v-model="showUpdateElementDialog">
      <template v-slot:title>
        Crear Pagina
      </template>
      <create-page @done="page => $router.push(`/website/preview/${page.path}`)" />
    </dialog-window>
  </q-bar>
</template>

<script>
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
export default {
  name: 'DynamicElementEditor',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  methods: {
    increaseSize () {
      const currentSizeIndex = sizes.indexOf(this.element.size_id)
      const newSizeIndex = (currentSizeIndex + sizes.length + 1) % sizes.length
      this.updateSize(sizes[newSizeIndex])
    },
    decreaseSize () {
      const currentSizeIndex = sizes.indexOf(this.element.size_id)
      const newSizeIndex = (currentSizeIndex + sizes.length - 1) % sizes.length
      this.updateSize(sizes[newSizeIndex])
    },
    async updateSize (size) {
      const where = {
        element_id: {
          _eq: this.element.element_id
        }
      }

      const _set = {
        size_id: size
      }
      try {
        await this.$store.dispatch('website/UPDATE_ELEMENT', { where, _set })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    }
  }
}
</script>
