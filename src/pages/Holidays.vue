<template>
  <q-page>
    <q-btn @click="showCreateHolidayDialog = true">Crear Feriado nuevo</q-btn>
    <pre>{{holidays}}</pre>
    <dialog-window v-model="showCreateHolidayDialog" title="Crear Feriados">
      <create-holiday class="scroll"></create-holiday>
    </dialog-window>
  </q-page>
</template>

<script>
import CreateHoliday from 'components/CreateHoliday'
import DialogWindow from 'components/DialogWindow'

export default {
  name: 'Holidays',
  components: { CreateHoliday, DialogWindow },
  data () {
    return {
      showCreateHolidayDialog: false,
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
