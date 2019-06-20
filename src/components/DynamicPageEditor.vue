<template>
  <q-bar>
    Pagina
    <q-btn @click="showUpdatePageDialog = true" flat dense icon="mdi-pencil">
      <q-tooltip>
        Editar Pagina
      </q-tooltip>
    </q-btn>
    <q-btn flat dense icon="mdi-plus" @click="addSection">
      <q-tooltip>
        Aggregar Seccion
      </q-tooltip>
    </q-btn>
    <q-space></q-space>
    <q-btn flat dense icon="mdi-delete" @click="removePage">
      <q-tooltip>
        Eliminar seccion
      </q-tooltip>
    </q-btn>
    <dialog-window v-model="showUpdatePageDialog" title="Editar Elemento">
      <q-form @submit="submit" @reset="reset" class="q-pa-md">
        <div class="q-gutter-y-md">
          <q-input
            filled
            required
            label="Nombre"
            hint="Nombre de uso interno"
            v-model="model.name"
            lazy-rules
            :rules="[
            ]"
          ></q-input>
          <q-input
            filled
            prefix="/"
            label="Ruta"
            hint="Ruta donde se encontrara la pagina. Debe ser unica"
            v-model="model.path"
            lazy-rules
            :rules="[
              value => /^([\w-]+(\/[\w-]+)*)?$/.test(value) ? true : 'Ruta invalida.'
            ]"
          ></q-input>

          <image-input filled v-model="model.image_id" format="background"></image-input>
        </div>
        <q-separator></q-separator>
        <div class="row justify-around q-pa-md">
          <q-btn color="secondary" flat type="reset">reset</q-btn>
          <q-btn color="primary" type="submit">Guardar</q-btn>
        </div>
        <q-inner-loading :showing="loading">
          <q-spinner></q-spinner>
        </q-inner-loading>
      </q-form>
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
      loading: false,
      showUpdatePageDialog: false,
      model: {
        image_id: null,
        path: '',
        name: ''
      }
    }
  },
  watch: {
    page () {
      this.reset()
    }
  },
  methods: {
    reset () {
      Object.keys(this.model).forEach(prop => {
        this.model[prop] = this.page[prop]
      })
    },
    async submit () {
      try {
        this.loading = true

        await this.$store.dispatch('website/UPDATE_PAGE', {
          where: { page_id: { _eq: this.page.page_id } },
          _set: this.model
        })

        if (this.page.path !== this.model.path) {
          this.$router.push(`/website/editor/${this.model.path}`)
        } else {
          await this.$store.dispatch('website/LOAD_PAGE')
        }

        this.showUpdatePageDialog = false
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    },
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
        await this.$store.dispatch('website/CREATE_SECTION', {
          page_id: this.page.page_id,
          index: this.page.sections.reduce((acc, section, index) => section.index !== index && index < acc ? index : acc, this.page.sections.length)
        })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    }
  },
  mounted () {
    this.reset()
  }
}
</script>
