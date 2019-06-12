<template>
  <q-img
    src="https://chuturubi.com/aviario.jpg"
    class="fixed-top-left fixed-bottom-right"
  >
    <template v-slot:loading></template>
  </q-img>
</template>

<script>
export default {
  name: 'BackgroundImage',
  props: {
    path: {
      type: String,
      required: false,
      default: ''
    }
  },
  mounted () {
    console.log('background path', this.path)
  }
}
</script>
