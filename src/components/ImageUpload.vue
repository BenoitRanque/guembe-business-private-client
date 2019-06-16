<template>
  <div>
    <q-select v-if="!format" dense v-model="selectedFormat" :options="formatOptions"></q-select>
    <q-uploader
      :disable="!uploadFormat"
      auto-upload
      with-credentials
      label="Aggregar Imagenes"
      bordered
      flat
      ref="uploader"
      @uploaded="uploaded"
      :url="url"
      accept=".jpg, .png, image/*"
      field-name="image"
      :headers="headers"
    >
    </q-uploader>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    format: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      selectedFormat: null
    }
  },
  computed: {
    formatOptions () {
      return this.$store.state.website.formats.map(({ format_id, name }) => ({ value: format_id, label: name }))
    },
    uploadFormat () {
      if (this.format) {
        return this.format
      }

      return this.selectedFormat ? this.selectedFormat.value : null
    },
    url () {
      return `https://chuturubi.com/api/v1/image/upload?format=${this.uploadFormat}`
    },
    headers () {
      return [{
        name: 'Authorization',
        value: `session-auth ${this.$q.sessionStorage.getItem('session-auth')}`
      }]
    }
  },
  methods: {
    uploaded (info) {
      this.$emit('done', info.xhr.response)
    }
  }
}
</script>
