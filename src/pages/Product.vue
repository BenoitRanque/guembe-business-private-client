<template>
  <q-page>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'Product',
  data () {
    return {
      loading: false
    }
  },
  methods: {

  }
}
</script>
