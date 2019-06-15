<template>
  <q-form>
    <div class="q-gutter-y-sm">
      <q-toolbar dense class="bg-primary text-white shadow-2 rounded-borders">
      </q-toolbar>
      <q-select dense label="Idioma" v-model="locale" :options="localeOptions" clearable dark bg-color="accent" filled></q-select>
      <image-input label="Imagen" dense filled v-model="model.image_id" format="card"></image-input>
      <q-input  label="Leyenda" dense filled v-model="model.caption"></q-input>
      <q-input label="Titulo" dense filled v-model="model.title"></q-input>
      <q-input label="Subtitulo" dense filled v-model="model.subtitle"></q-input>
      <q-editor v-model="model.body"></q-editor>
      <pre>{{localeOptions}}</pre>
      <pre>{{locale}}</pre>
      <!-- <pre>{{locales}}</pre> -->
    </div>
  </q-form>
</template>

<script>
import ImageInput from 'components/ImageInput'
export default {
  name: 'UpdateElementI18n',
  components: { ImageInput },
  data () {
    return {
      locale: null, // set this using the element prop
      model: {
        image_id: null,
        caption: '',
        title: '',
        subtitle: '',
        body: ''
      }
    }
  },
  computed: {
    updated () {
      // wether the model has been updated or not
      return true
    },
    locales () {
      return this.$store.state.website.locales
    },
    localeOptions () {
      return this.locales.map(({ locale_id, name }) => ({ value: locale_id, label: name }))
    },
    localeDisplayValue () {
      return this.locale ? this.locale.name : 'Todos'
    }
  },
  methods: {
    reset () {
      this.locale = this.locales.find(locale => locale.locale_id === this.$store.state.website.locale)
      this.model.image_id = null
      this.model.caption = ''
      this.model.title = ''
      this.model.subtitle = ''
      this.model.body = ''
    }
  },
  mounted () {
    // this.reset()
  }
}
</script>
