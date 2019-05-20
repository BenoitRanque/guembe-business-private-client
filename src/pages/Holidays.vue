<template>
  <q-page>
    <q-btn @click="$router.push('/holiday')">Crear Feriado nuevo</q-btn>
    <pre>{{holidays}}</pre>
  </q-page>
</template>

<script>
export default {
  name: 'Holidays',
  data () {
    return {
      loading: false,
      holidays: []
    }
  },
  methods: {
    async loadHolidays () {
      const query = /* GraphQL */`query {
        holidays: calendar_holiday {
          public_name
          private_name
          description
          date
        }
      }`

      const variables = {}

      try {
        this.loading = true

        const { holidays } = await this.$gql(query, variables, { role: 'administrator' })

        this.holidays = holidays
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadHolidays()
  }
}
</script>
