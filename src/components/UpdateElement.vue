<template>
  <q-form class="q-gutter-y-sm" @submit="submit" @reset="reset">
    <q-select
      dense
      label="Tipo Vinculo"
      v-model="mode"
      :options="options.mode"
      dark
      bg-color="accent"
      filled
    ></q-select>
    <template v-if="mode === LINK_EXTERNAL">
      <q-input filled dense v-model="external" :label="LINK_EXTERNAL"></q-input>
    </template>
    <template v-else-if="mode === LINK_INTERNAL">
      <q-select :loading="loadingOptions" dense filled v-model="internal" :options="options.internal" :label="LINK_INTERNAL"></q-select>
    </template>
    <template v-else-if="mode === LINK_LISTING">
      <q-select :loading="loadingOptions" dense filled v-model="listing" :options="options.listing" :label="LINK_LISTING"></q-select>
    </template>
    <div class="row justify-around q-pa-md">
      <q-btn color="secondary" flat type="reset">reset</q-btn>
      <q-btn color="primary" type="submit">Guardar</q-btn>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-form>
</template>

<script>

const LINK_NONE = 'Ninguno'
const LINK_EXTERNAL = 'Vinculo Externo'
const LINK_INTERNAL = 'Vinculo Interno'
const LINK_LISTING = 'Vinculo Paquete'

export default {
  name: 'UpdateElement',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      LINK_NONE,
      LINK_EXTERNAL,
      LINK_INTERNAL,
      LINK_LISTING,
      options: {
        internal: [],
        listing: [],
        mode: [
          LINK_NONE,
          LINK_EXTERNAL,
          LINK_INTERNAL,
          LINK_LISTING
        ]
      },
      loading: false,
      loadingOptions: false,
      external: '',
      internal: null,
      listing: null,
      mode: LINK_NONE
    }
  },
  watch: {
    element () {
      this.reset()
    },
    mode () {
      this.loadOptions()
    }
  },
  computed: {
    external_link () {
      return this.external ? this.external : null
    },
    internal_link () {
      return this.internal ? this.internal.value : null
    },
    listing_link () {
      return this.listing ? this.listing.value : null
    },
    updateLinks () {
      const links = {
        internal_link: null,
        external_link: null,
        listing_link: null
      }

      switch (this.mode) {
        case LINK_INTERNAL:
          links.internal_link = this.internal_link
          break
        case LINK_EXTERNAL:
          links.external_link = this.external_link
          break
        case LINK_LISTING:
          links.listing_link = this.listing_link
          break
      }

      return links
    }
  },
  methods: {
    async loadOptions () {
      // load options if apropriate
      if (this.mode !== LINK_INTERNAL && this.mode !== LINK_LISTING) {
        return
      }

      try {
        this.loadingOptions = true

        if (this.mode === LINK_INTERNAL) {
          await this.getInternalOptions()
        } else if (this.mode === LINK_LISTING) {
          await this.getListingOptions()
        }
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loadingOptions = false
      }
    },
    async getListingOptions () {
      const query = /* GraphQL */`query ($where: webstore_listing_bool_exp) {
        options: webstore_listing (where: $where) {
          value: listing_id
          label: name
        }
      }`

      const variables = {
        where: {
          available_to: {
            _gte: new Date().toISOString()
          }
        }
      }

      const { options } = await this.$gql(query, variables, { role: 'administrator' })

      this.options.listing = options
    },
    async getInternalOptions () {
      const query = /* GraphQL */`query {
        options: website_page {
          value: path
          label: name
        }
      }`

      const { options } = await this.$gql(query, {}, { role: 'administrator' })

      this.options.internal = options
    },
    reset () {
      if (this.element.external_link) {
        this.mode = LINK_EXTERNAL
        this.external = this.element.external_link
      } else if (this.element.internal_link) {
        this.mode = LINK_INTERNAL
        this.internal = {
          value: this.element.internal_link,
          label: (this.options.internal.find(opt => opt.value === this.element.internal_link) || { label: this.element.internal_link }).label
        }
      } else if (this.element.listing_link) {
        this.mode = LINK_LISTING
        this.listing = {
          value: this.element.listing,
          label: (this.options.listing.find(opt => opt.value === this.element.listing_link) || { label: this.element.listing_link }).label
        }
      } else {
        this.mode = LINK_NONE
      }
    },
    async submit () {
      try {
        this.loading = true

        await this.$store.dispatch('website/UPDATE_ELEMENT', {
          where: {
            element_id: { _eq: this.element.element_id }
          },
          _set: {
            ...this.updateLinks
          }
        })
        this.$q.notify({ color: 'positive', icon: 'mdi-check', message: 'Actualizado Exitosamente' })

        await this.$store.dispatch('website/LOAD_PAGE')

        this.$emit('done')
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.reset()
  }
}
</script>
