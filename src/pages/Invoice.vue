<template>
  <q-page>
    <pre>{{invoice}}</pre>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'Invoice',
  props: {
    invoiceId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      loading: false,
      invoice: null
    }
  },
  methods: {
    async loadData () {
      const query = /* GraphQL */`query ($invoice_id: uuid!) {
        data: store_invoice_by_pk (invoice_id: $invoice_id) {
          invoice_id
          purchase_id
          invoice_id
          created_at
          purchase_id
          purchase {
            client {
              client_id
              name
            }
          }
          izi_link
          izi_numero
          izi_comprador
          izi_razon_social
          izi_autorizacion
          izi_monto_total
          izi_control
        }
      }`

      const variables = {
        invoice_id: this.invoiceId
      }

      try {
        this.loading = true

        const { data } = await this.$gql(query, variables, { role: 'administrator' })

        this.invoice = data
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
