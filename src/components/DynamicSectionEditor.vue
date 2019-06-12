<template>
  <div class="q-my-md">
    <q-card>
      <q-card-section>
        Seccion
      </q-card-section>
      <q-card-section>
        <q-btn @click="addElement"> Aggregar elemento</q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'DynamicSectionEditor',
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  methods: {
    async addElement () {
      try {
        await this.$store.dispatch('website/CREATE_ELEMENT', { section_id: this.section.section_id, index: this.section.elements.length, size_id: 'md' })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    }
  }
}
</script>
