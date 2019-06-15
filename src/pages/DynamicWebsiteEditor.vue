<template>
  <q-page>
    <dynamic-page v-if="page" :page="page">
      <template v-slot:editor>
        <q-card>
          <dynamic-page-editor :page="page"></dynamic-page-editor>
        </q-card>
      </template>
      <dynamic-section v-for="(section, index) in page.sections" :key="`section_${index}`" :section="section">
        <dynamic-element v-for="(element, index) in section.elements" :key="`element_${index}`" :element="element">
          <template v-slot:editor>
            <dynamic-element-editor :element="element"></dynamic-element-editor>
          </template>
        </dynamic-element>
        <template v-slot:editor>
          <q-card class="q-mb-md">
            <dynamic-section-editor :section="section"></dynamic-section-editor>
          </q-card>
        </template>
      </dynamic-section>
    </dynamic-page>
    <q-inner-loading v-else :showing="true">
      <q-spinner></q-spinner>
    </q-inner-loading>
    <q-page-sticky position="top-right" :offset="[16, 16]">
      <q-btn icon="mdi-check" color="white" text-color="black" size="sm" round @click="$router.push(`/website/preview/${path}`)"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import DynamicPage from 'components/DynamicPage'
import DynamicPageEditor from 'components/DynamicPageEditor'
import DynamicSection from 'components/DynamicSection'
import DynamicSectionEditor from 'components/DynamicSectionEditor'
import DynamicElement from 'components/DynamicElement'
import DynamicElementEditor from 'components/DynamicElementEditor'
export default {
  name: 'DynamicWebsite',
  components: { DynamicPage, DynamicPageEditor, DynamicSection, DynamicSectionEditor, DynamicElement, DynamicElementEditor },
  props: {
    path: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    page () {
      return this.$store.state.website.page
    }
  },
  methods: {

  },
  mounted () {
    this.$store.dispatch('website/LOAD_PAGE', { path: this.path })
  }
}
</script>
