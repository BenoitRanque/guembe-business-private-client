<template>
  <q-card>
    <q-card-section>
      pagina
    </q-card-section>
    <q-card-section>
      <q-btn @click="addSection"> Aggregar grupo</q-btn>
    </q-card-section>
    <q-card-section>

      <pre>{{$store.state.website.page}}</pre>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'DynamicPageEditor',
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  methods: {
    async addSection () {
      try {
        await this.$store.dispatch('website/CREATE_SECTION', { page_id: this.page.page_id, index: this.page.sections.length })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    }
  }
}
</script>
