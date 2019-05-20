<template>
  <q-page padding>
    <pre>{{holiday}}</pre>
  </q-page>
</template>

<script>

export default {
  name: 'Holiday',
  props: {
    holidayId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      holiday: null
    }
  },
  methods: {
    async loadHoliday () {
      const query = /* GraphQL */`query ($holiday_id: uuid!) {
        holiday: calendar_holiday_by_pk (holiday_id: $holiday_id) {
          holiday_id
          private_name
          date
        }
      }`

      const variables = {
        holiday_id: this.holidayId
      }

      try {
        this.loading = true

        const { holiday } = await this.$gql(query, variables, { role: 'administrator' })

        this.holiday = holiday
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadHoliday()
  }
}
</script>
