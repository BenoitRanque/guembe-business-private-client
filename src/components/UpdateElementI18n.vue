<template>
  <q-form class="q-gutter-y-sm" @submit="submit" @reset="reset">
    <q-select dense label="Idioma" :value="locale" @input="changeLocale" :display-value="localeDisplayValue" :options="localeOptions" clearable dark bg-color="accent" filled></q-select>
    <image-input label="Imagen" dense filled v-model="model.image_id"></image-input>
    <q-input label="Leyenda" dense filled v-model="model.caption"></q-input>
    <q-input label="Titulo" dense filled v-model="model.title"></q-input>
    <q-input label="Subtitulo" dense filled v-model="model.subtitle"></q-input>
    <q-editor v-model="model.body"></q-editor>
    <div class="row justify-around q-pa-md">
      <q-btn color="secondary" flat type="reset">reset</q-btn>
      <q-btn color="primary" type="submit">Guardar</q-btn>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-form>
</template>

<script>
import ImageInput from 'components/ImageInput'
export default {
  name: 'UpdateElementI18n',
  components: { ImageInput },
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
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
    updateFields () {
      return Object.keys(this.model).reduce((updateFields, prop) => {
        updateFields[prop] = this.model[prop] ? this.model[prop] : null
        return updateFields
      }, {})
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
  watch: {
    locale () {
      this.reset()
    }
  },
  methods: {
    changeLocale (locale) {
      if (this.updated) {
        this.$q.dialog({
          title: 'Cambiar Idioma',
          message: 'Si cambia el idioma ahora podria perder todos sus cambios',
          cancel: true
        }).onOk(() => {
          this.locale = locale
        })
      } else {
        this.locale = locale
      }
    },
    async reset () {
      if (!this.locale) {
        return
      }

      const variables = {
        locale_id: this.locale.value,
        element_id: this.element.element_id
      }
      try {
        this.loading = true

        const localization = await this.$store.dispatch('website/LOAD_ELEMENT_I18N_BY_PK', variables)

        Object.keys(localization).forEach(prop => {
          this.model[prop] = localization[prop] ? localization[prop] : ''
        })
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    },
    async submit (confirmed = false) {
      if (!this.locale && confirmed !== true) {
        return this.$q.dialog({
          title: 'No a seleccionado nigun idioma',
          message: 'Si continua, se guardaran los cambios para todos los idioma.',
          cancel: true
        }).onOk(() => {
          this.submit(true)
        })
      }
      const variables = {
        _set: this.updateFields,
        where: {
          element_id: { _eq: this.element.element_id },
          locale_id: this.locale ? { _eq: this.locale.value } : null
        }
      }

      try {
        this.loading = true

        await this.$store.dispatch('website/UPDATE_ELEMENT_I18N', variables)
        await this.$store.dispatch('website/LOAD_PAGE')

        this.$q.notify({ color: 'positive', icon: 'mdi-check', message: 'Actualizado Exitosamente' })

        this.$emit('done')
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    const currentLocale = this.$store.state.website.locale
    const stateLocale = this.locales.find(locale => locale.locale_id === currentLocale)
    if (stateLocale) {
      this.locale = {
        value: stateLocale.locale_id,
        label: stateLocale.name
      }
    }
  }
}
</script>
