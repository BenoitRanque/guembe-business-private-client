<template>
  <div class="q-pa-md dynamic-page q-gutter-md">
    <slot name="editor" />
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DynamicPage',
  props: {
    page: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus">
  .dynamic-page
    margin 0 auto
    max-width 992px
</style>
