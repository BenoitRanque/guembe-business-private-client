<template>
  <q-bar>
    Pagina
    <q-btn @click="showUpdatePageDialog = true" flat dense icon="mdi-pencil">
      <q-tooltip>
        Editar Pagina
      </q-tooltip>
    </q-btn>
    <q-space></q-space>
    <q-btn flat dense icon="mdi-delete" @click="removePage">
      <q-tooltip>
        Eliminar seccion
      </q-tooltip>
    </q-btn>
    <dialog-window v-model="showUpdatePageDialog">
      <template v-slot:title>
        Editar Pagina
      </template>
      <q-card-section>
        pagina
      </q-card-section>
      <q-card-section>
        <image-input :value="page.image_id" @input="updateImage" format="background"></image-input>
      </q-card-section>
      <q-card-section>
        <q-btn @click="addSection"> Aggregar Seccion</q-btn>
      </q-card-section>
      <q-expansion-item label="State">
        <q-card-section class="scroll">
          <pre>{{$store.state.website}}</pre>
        </q-card-section>
      </q-expansion-item>
    </dialog-window>
  </q-bar>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
import ImageInput from 'components/ImageInput'
export default {
  name: 'DynamicPageEditor',
  components: { ImageInput, DialogWindow },
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showUpdatePageDialog: false
    }
  },
  methods: {
    removePage () {
      this.$q.dialog({
        title: 'Eliminar Pagina',
        message: `Esta accion es ireversible. Se Elimninara esta pagina, sus secciones, y todos sus elementos. Para confirmar escriba el nombre de la pagina: ${this.page.name}`,
        prompt: {
          model: '',
          type: 'text'
        },
        cancel: true
      }).onOk(async pageName => {
        if (pageName !== this.page.name) {
          return this.$q.notify({ message: 'Nombre de pagina no coincide', color: 'warning' })
        }
        try {
          await this.$store.dispatch('website/DELETE_PAGE', { where: { page_id: { _eq: this.page.page_id } } })
          this.$router.push('/website')
        } catch (error) {
          this.$gql.handleError(error)
        }
      })
    },
    async addSection () {
      try {
        await this.$store.dispatch('website/CREATE_SECTION', { page_id: this.page.page_id, index: this.page.sections.length })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    },
    async updateImage (image_id) {
      const where = {
        page_id: {
          _eq: this.page.page_id
        }
      }

      const _set = {
        image_id
      }

      try {
        await this.$store.dispatch('website/UPDATE_PAGE', { where, _set })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    }
  }
}
</script>
