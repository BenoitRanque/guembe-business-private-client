<template>
  <q-bar>
    <!-- <q-btn @click="showUpdateSectionDialog = true" flat dense icon="mdi-pencil">
      <q-tooltip>
        Editar Seccion
      </q-tooltip>
    </q-btn> -->
    Seccion
    {{section.index + 1}}
    <q-btn flat dense icon="mdi-plus" @click="addElement">
        <q-tooltip>
          Aggregar Elemento
        </q-tooltip>
      </q-btn>
    <q-space></q-space>
    <!-- <q-btn-group flat>
      <q-btn flat icon="mdi-chevron-down" dense>
        <q-tooltip>
          Bajar
        </q-tooltip>
      </q-btn>
      <q-btn flat icon="mdi-chevron-up" dense>
        <q-tooltip>
          Subir
        </q-tooltip>
      </q-btn>
    </q-btn-group> -->
    <q-btn flat dense icon="mdi-delete" @click="removeSection">
      <q-tooltip>
        Eliminar seccion
      </q-tooltip>
    </q-btn>
    <dialog-window v-model="showUpdateSectionDialog">
      <template v-slot:title>
        Editar Seccion
      </template>
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
    section: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showUpdateSectionDialog: false
    }
  },
  methods: {
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
