<template>
  <q-bar>
    <q-btn-group flat>
      <q-btn @click="showUpdateElementDialog = true" flat size="sm" dense icon="mdi-pencil">
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
        Editar Elemento
      </template>
      <image-input :value="element.image" @input="updateImage" format="card"></image-input>
      <pre>{{element}}</pre>
    </dialog-window>
  </q-bar>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
import ImageInput from 'components/ImageInput'
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
export default {
  name: 'DynamicElementEditor',
  components: { DialogWindow, ImageInput },
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showUpdateElementDialog: false
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
    },
    async updateImage (image_id) {
      const where = {
        element_id: {
          _eq: this.element.element_id
        }
      }

      const _set = {
        image_id
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
