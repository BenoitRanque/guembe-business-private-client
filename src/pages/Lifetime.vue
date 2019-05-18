<template>
  <q-page>
    <pre>{{lifetime}}</pre>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'Lifetime',
  props: {
    lifetimeId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      loading: false,
      lifetime: null
    }
  },
  methods: {
    async loadData () {
      const query = /* GraphQL */`query ($lifetime_id: uuid!) {
        data: calendar_lifetime_by_pk (lifetime_id: $lifetime_id) {
          lifetime_id
          public_name
          private_name
          description
          start
          end
          lifetime_weekdays {
            weekday {
              weekday_name
            }
          }
          created_at
          created_by_user {
            username
          }
          updated_at
          updated_by_user {
            username
          }
        }
      }`

      const variables = {
        lifetime_id: this.lifetimeId
      }

      try {
        this.loading = true

        const { data } = await this.$gql(query, variables, { role: 'administrator' })

        this.lifetime = data
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
