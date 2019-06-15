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
    <q-btn-group flat>
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
    </q-btn-group>
    <q-btn flat dense icon="mdi-delete">
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
    async addElement () {
      try {
        await this.$store.dispatch('website/CREATE_ELEMENT', { section_id: this.section.section_id, index: this.section.elements.length, size_id: 'md' })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    }
  }
}
</script>
