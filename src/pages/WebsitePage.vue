<template>
  <q-page padding>
    <pre>
      {{page}}
    </pre>
    <div class="text-center q-pa-md bg-blue-1" v-for="(section, index) in page.sections" :key="index">
      <q-btn round icon="mdi-plus" color="accent" @click="addElement(section.section_id, section.elements.length)"></q-btn>
    </div>
    <div class="text-center q-pa-md">
      <q-btn round icon="mdi-plus" color="accent" @click="addSection(page.page_id, page.sections.length)"></q-btn>
    </div>
    <dialog-window v-model="showCreateElementDialog" title="Crear Elemento">
      <create-element />
    </dialog-window>
  </q-page>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
import CreateElement from 'components/CreateElement'
export default {
  name: 'WebsitePage',
  components: { DialogWindow, CreateElement },
  props: {
    path: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      showCreateElementDialog: false,
      page: null
    }
  },
  methods: {
    async addSection (pageId, index) {
      const query = /* GraphQL */`mutation ($objects: [website_section_insert_input!]!) {
        insert_website_section (objects: $objects) {
          affected_rows
        }
      }`

      const variables = {
        objects: {
          page_id: pageId,
          index
        }
      }

      try {
        await this.$gql(query, variables, { role: 'administrator' })
        this.loadPage()
      } catch (error) {
        this.$gql.handleError(error)
      }
    },
    async addElement (sectionId, index) {
      const query = /* GraphQL */`mutation ($objects: [website_element_insert_input!]!) {
        insert_website_element (objects: $objects) {
          affected_rows
        }
      }`

      const variables = {
        objects: {
          section_id: sectionId,
          index
        }
      }

      try {
        await this.$gql(query, variables, { role: 'administrator' })
        this.loadPage()
      } catch (error) {
        this.$gql.handleError(error)
      }
    },
    async loadPage () {
      const query = /* GraphQL */`query ($where: website_page_bool_exp) {
        pages: website_page (where: $where) {
          page_id
          name
          path
          sections (order_by: { index: asc }) {
            section_id
            elements (order_by: { index: asc }) {
              element_id
              size_id
              i18n {
                body
                caption
                subtitle
                title
              }
            }
          }
        }
      }`

      const variables = {
        where: {
          path: {
            _eq: this.path
          }
        }
      }

      try {
        const { pages: [ page ] } = await this.$gql(query, variables, { role: 'administrator' })

        if (!page) {
          return this.$router.push('/Error404')
        }

        this.page = page
      } catch (error) {
        this.$gql.handleError(error)
      }
    }
  },
  mounted () {
    this.loadPage()
  }
}
</script>
