<template>
  <q-card>
    <q-card-section>
      pagina
    </q-card-section>
    <q-card-section>
      <image-input :value="page.image_id" @input="updateImage" format="background"></image-input>
    </q-card-section>
    <q-card-section>
      <q-btn @click="addSection"> Aggregar grupo</q-btn>
    </q-card-section>
    <q-expansion-item label="State">
      <q-card-section class="scroll">
        <pre>{{$store.state.website}}</pre>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
import ImageInput from 'components/ImageInput'
export default {
  name: 'DynamicPageEditor',
  components: { ImageInput },
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
    },
    async updateImage (image_id) {
      const where = {
        page_id: {
          _eq: this.page.page_id
        }
      }

      const _set = {
        image_id
      }

      try {
        await this.$store.dispatch('website/UPDATE_PAGE', { where, _set })
        await this.$store.dispatch('website/LOAD_PAGE')
      } catch (error) {
        this.$gql.handleError(error)
      }
    }
  }
}
</script>
