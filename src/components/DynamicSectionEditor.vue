<template>
  <q-bar>
    <!-- <q-btn @click="showUpdateSectionDialog = true" flat dense icon="mdi-pencil">
      <q-tooltip>
        Editar Seccion
      </q-tooltip>
    </q-btn> -->
    Seccion
    {{section.index + 1}}
    <q-btn-group flat>
      <q-btn
        flat
        dense
        @click="update({ fullwidth: !section.fullwidth })"
        :icon="`mdi-arrow-${section.fullwidth ? 'collapse' : 'expand'}-horizontal`"
      >
        <q-tooltip>
          {{section.fullwidth ? 'Anchura Normal' : 'Anchura Completa'}}
        </q-tooltip>
      </q-btn>
      <q-btn flat dense icon="mdi-plus" @click="addElement">
        <q-tooltip>
          Aggregar Elemento
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
    </q-btn-group>
    <q-btn flat dense icon="mdi-delete" @click="removeSection">
      <q-tooltip>
        Eliminar seccion
      </q-tooltip>
    </q-btn>
    <dialog-window v-model="showUpdateSectionDialog" title="Editar Seccion">
      <q-btn flat dense icon="mdi-plus" @click="addElement">
        <q-tooltip>
          Aggregar Elemento
        </q-tooltip>
      </q-btn>
    </dialog-window>
  </q-bar>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
export default {
  name: 'DynamicSectionEditor',
  components: { DialogWindow },
  props: {
    page: {
      type: Object,
      required: true
    },
    section: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      movingUp: false,
      movingDown: false,
      showUpdateSectionDialog: false
    }
  },
  computed: {
    nextIndex () {
      const greaterIndexes = this.page.sections.map(({ index }) => index).filter(index => index > this.section.index)
      if (!greaterIndexes.length) return null
      return Math.min(...greaterIndexes)
    },
    previousIndex () {
      const lesserIndexes = this.page.sections.map(({ index }) => index).filter(index => index < this.section.index)
      if (!lesserIndexes.length) return null
      return Math.max(...lesserIndexes)
    },
    canMoveDown () {
      return this.nextIndex !== null
    },
    canMoveUp () {
      return this.previousIndex !== null
    }
  },
  methods: {
    async update (update) {
      try {
        await this.$store.dispatch('website/UPDATE_SECTION', { _set: update, where: { section_id: { _eq: this.section.section_id } } })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    },
    async moveDown () {
      if (!this.canMoveDown) return

      try {
        this.movingDown = true

        await this.$store.dispatch('website/SWAP_PAGE_SECTIONS', {
          page_id: this.page.page_id,
          index_a: this.section.index,
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

        await this.$store.dispatch('website/SWAP_PAGE_SECTIONS', {
          page_id: this.page.page_id,
          index_a: this.section.index,
          index_b: this.previousIndex
        })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$api.handleError(error)
      } finally {
        this.movingUp = false
      }
    },
    removeSection () {
      this.$q.dialog({
        title: 'Eliminar Seccion',
        message: 'Esta accion es ireversible. Se Elimninara esta seccion y todos sus elementos. Para confirmar escriba el numero de la seccion',
        prompt: {
          model: '',
          type: 'number'
        },
        cancel: true
      }).onOk(async sectionIndex => {
        if (sectionIndex !== String(this.section.index + 1)) {
          return this.$q.notify({ message: 'Numero incorrecto. Debe ingresar el numero de la seccion', color: 'warning' })
        }
        try {
          await this.$store.dispatch('website/DELETE_SECTION', { where: { section_id: { _eq: this.section.section_id } } })
          await this.$store.dispatch('website/LOAD_PAGE')
        } catch (error) {
          this.$gql.handleError(error)
        }
      })
    },
    async addElement () {
      try {
        const objects = {
          section_id: this.section.section_id,
          index: this.section.elements.reduce((acc, element, index) => element.index !== index && index < acc ? index : acc, this.section.elements.length),
          size_id: 'md',
          i18n: {
            data: this.$store.state.website.locales.map(({ locale_id }) => ({ locale_id }))
          }
        }
        await this.$store.dispatch('website/CREATE_ELEMENT', objects)
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    }
  }
}
</script>
