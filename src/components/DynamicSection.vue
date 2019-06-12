<template>
  <section class="dynamic-page-section">
    <div class="row wrap q-col-gutter-md">
      <slot />
    </div>
    <slot name="editor" />
  </section>
</template>

<script>
export default {
  name: 'DynamicSection',
  props: {
    section: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus">
  .dynamic-page-section
    margin 0 auto
    max-width 992px
</style>
