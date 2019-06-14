<template>
  <section>
    <template v-if="section.slider">
      <div style="heigh: 30px; overflow: hidden; padding-top: 50%;" class="relative-position q-mb-md">
        <div class="fit absolute-top-left">
          <!-- <pre>{{section}}</pre> -->
          <q-carousel
            keep-alive
            animated
            v-model="slide"
            height="100%"
            :autoplay="10000"
            :arrows="section.elements.length > 1"
            :infinite="section.elements.length > 1"
            :navigation="section.elements.length > 1"
          >
            <slot />
          </q-carousel>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="row wrap q-col-gutter-md">
        <slot />
      </div>
    </template>
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
