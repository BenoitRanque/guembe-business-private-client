<template>
  <div>
    <div>
      <slot />
    </div>
    <slot name="editor" />
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
