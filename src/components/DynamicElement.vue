<template>
  <div :class="elementClass">
    <q-card>
      <q-img
        v-if="element.image"
        :src="$img.src(element.image.image_id)"
        :srcset="$img.srcset(element.image)"
        :sizes="imageSizes"
        :placeholder="element.image.placeholder"
      ></q-img>
      <q-card-section v-if="element.title || element.subtitle">
        <div v-if="element.title" class="text-h6 text-primary">{{element.title}}</div>
        <div v-if="element.subtitle" class="text-subtitle2 text-accent">{{element.subtitle}}</div>
      </q-card-section>
      <slot name="editor"></slot>
      <q-card-section v-if="element.body">
        <div v-html="element.body"></div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'DynamicElement',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageSizes () {
      switch (this.element.size_id) {
        case 'xl': return '100vw'
        case 'lg': return '80vw'
        case 'md': return '50vw'
        case 'sm': return '33vw'
        case 'xs': return '25vw'
        default: return ''
      }
    },
    elementClass () {
      switch (this.element.size_id) {
        case 'xl': return 'col-12'
        case 'lg': return 'col-8'
        case 'md': return 'col-6'
        case 'sm': return 'col-4'
        case 'xs': return 'col-3'
        default: return ''
      }
    }
  }
}
</script>
