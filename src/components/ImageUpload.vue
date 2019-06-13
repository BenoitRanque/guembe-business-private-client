<template>
  <q-uploader
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
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    format: {
      type: String,
      required: true
    }
  },
  computed: {
    url () {
      return `https://chuturubi.com/api/v1/image/upload?format=${this.format}`
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
