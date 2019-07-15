<template>
  <q-bar>
    <q-btn-group flat>
      <q-btn @click="showUpdateElementDialog = true" flat dense icon="mdi-pencil">
        <q-tooltip>
          Editar Contenido
        </q-tooltip>
      </q-btn>
      <q-btn @click="increaseSize" flat icon="mdi-arrow-expand-all" dense>
        <q-tooltip>
          Aumentar tamaño
        </q-tooltip>
      </q-btn>
      <q-btn @click="decreaseSize" flat icon="mdi-arrow-collapse-all" dense>
        <q-tooltip>
          Disminuir tamaño
        </q-tooltip>
      </q-btn>
    </q-btn-group>
    <q-space></q-space>
    <q-btn-group flat>
      <q-btn flat icon="mdi-chevron-down" dense :disable="!canMoveDown" :loading="movingDown" @click="moveDown">
        <q-tooltip>
          Bajar
        </q-tooltip>
      </q-btn>
      <q-btn flat icon="mdi-chevron-up" dense :disable="!canMoveUp" :loading="movingUp" @click="moveUp">
        <q-tooltip>
          Subir
        </q-tooltip>
      </q-btn>
      <q-btn flat dense icon="mdi-delete" @click="deleteElement">
        <q-tooltip>
          Eliminar elemento
        </q-tooltip>
      </q-btn>
    </q-btn-group>
    <dialog-window v-model="showUpdateElementDialog" title="Editar Elemento">
      <q-tabs dense v-model="tab">
        <q-tab name="element" label="Elemento"></q-tab>
        <q-tab name="i18n" label="Idiomas"></q-tab>
      </q-tabs>
      <q-tab-panels v-model="tab">
        <q-tab-panel name="element">
          <update-element :element="element" @done="() => {}"></update-element>
        </q-tab-panel>
        <q-tab-panel name="i18n">
          <update-element-i18n :element="element" @done="() => {}"></update-element-i18n>
        </q-tab-panel>
      </q-tab-panels>
    </dialog-window>
  </q-bar>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
import UpdateElement from 'components/UpdateElement'
import UpdateElementI18n from 'components/UpdateElementI18n'
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
export default {
  name: 'DynamicElementEditor',
  components: { DialogWindow, UpdateElement, UpdateElementI18n },
  props: {
    section: {
      type: Object,
      required: true
    },
    element: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      movingDown: false,
      movingUp: false,
      tab: 'element',
      locale: null,
      showUpdateElementDialog: false
    }
  },
  computed: {
    nextIndex () {
      const greaterIndexes = this.section.elements.map(({ index }) => index).filter(index => index > this.element.index)
      if (!greaterIndexes.length) return null
      return Math.min(...greaterIndexes)
    },
    previousIndex () {
      const lesserIndexes = this.section.elements.map(({ index }) => index).filter(index => index < this.element.index)
      if (!lesserIndexes.length) return null
      return Math.max(...lesserIndexes)
    },
    canMoveDown () {
      return this.nextIndex !== null
    },
    canMoveUp () {
      return this.previousIndex !== null
    },
    locales () {
      return this.$store.state.website.locales
    }
  },
  methods: {
    async moveDown () {
      if (!this.canMoveDown) return

      try {
        this.movingDown = true

        await this.$store.dispatch('website/SWAP_SECTION_ELEMENTS', {
          section_id: this.section.section_id,
          index_a: this.element.index,
          index_b: this.nextIndex
        })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$api.handleError(error)
      } finally {
        this.movingDown = false
      }
    },
    async moveUp () {
      if (!this.canMoveUp) return

      try {
        this.movingUp = true

        await this.$store.dispatch('website/SWAP_SECTION_ELEMENTS', {
          section_id: this.section.section_id,
          index_a: this.element.index,
          index_b: this.previousIndex
        })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$api.handleError(error)
      } finally {
        this.movingUp = false
      }
    },
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
    deleteElement () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Eliminar Elemento?',
        cancel: true
      }).onOk(async () => {
        try {
          await this.$store.dispatch('website/DELETE_ELEMENT', { where: { element_id: { _eq: this.element.element_id } } })
          await this.$store.dispatch('website/LOAD_PAGE')
        } catch (error) {
          this.$gql.handleError(error)
        }
      })
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
