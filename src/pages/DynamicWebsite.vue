<template>
  <q-page>
    <dynamic-page v-if="page" :page="page">
      <dynamic-section v-for="(section, index) in page.sections" :key="`section_${index}`" :section="section">
        <dynamic-element v-for="(element, index) in section.elements" :key="`element_${index}`" :element="element">
        </dynamic-element>
      </dynamic-section>
    </dynamic-page>
    <q-inner-loading :showing="!page">
      <q-spinner></q-spinner>
    </q-inner-loading>
    <q-page-sticky position="top-right" :offset="[16, 16]">
      <q-btn icon="mdi-pencil" color="white" text-color="black" size="sm" round @click="$router.push(`/website/editor/${path}`)"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import DynamicPage from 'components/DynamicPage'
import DynamicSection from 'components/DynamicSection'
import DynamicElement from 'components/DynamicElement'
export default {
  name: 'DynamicWebsite',
  components: { DynamicPage, DynamicSection, DynamicElement },
  props: {
    path: {
      type: String,
      required: false,
      default: ''
    }
  },
  watch: {
    $route (to, from) {
      this.$store.dispatch('website/LOAD_PAGE', { path: to.params.path })
    }
  },
  computed: {
    page () {
      return this.$store.state.website.page
    }
  },
  methods: {

  },
  async mounted () {
    try {
      await this.$store.dispatch('website/LOAD_PAGE', { path: this.path })
    } catch (error) {
      this.$gql.handleError(error)
    }
  }
}
</script>
