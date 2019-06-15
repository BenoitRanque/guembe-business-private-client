<template>
  <q-form>
    <q-toolbar dense class="bg-primary text-white shadow-2 rounded-borders">
      <q-toolbar-title>
        Vinculo
      </q-toolbar-title>
      <q-tabs shrink v-model="tab">
        <q-tab name="none" label="Niguno"></q-tab>
        <q-tab name="internal" label="Interno"></q-tab>
        <q-tab name="external" label="Externo"></q-tab>
        <q-tab name="listing" label="Paquete"></q-tab>
      </q-tabs>
    </q-toolbar>
    <q-tab-panels v-model="tab">
      <q-tab-panel name="none">
        No tiene vinculo
      </q-tab-panel>
      <q-tab-panel name="internal">
        vinculo interno
      </q-tab-panel>
      <q-tab-panel name="external">
        vinculo externo
      </q-tab-panel>
      <q-tab-panel name="listing">
        listing
      </q-tab-panel>
    </q-tab-panels>
  </q-form>
</template>

<script>
export default {
  name: 'UpdateElement',
  data () {
    return {
      tab: 'none',
      options: {
        listings: [
          '123'
        ],
        pages: [
          '456'
        ],
        type: [
          { value: 'none', label: 'Ninguno' },
          { value: 'internal', label: 'Interno' },
          { value: 'external', label: 'Externo' },
          { value: 'listing', label: 'Paquete' }
        ]
      },
      type: null,
      internal_link: null,
      external_link: null,
      listing_link: null
    }
  }
}
</script>
