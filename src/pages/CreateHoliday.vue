<template>
  <q-page padding>
    <q-form @submit="submit" @reset="reset" class="q-gutter-md" style="max-width: 600px">
      <q-input
        filled
        required
        label="Nombre Privado"
        hint="Nombre de uso interno"
        v-model="holiday.private_name"
      ></q-input>
      <q-input
        filled
        required
        label="Nombre Publico"
        hint="Nombre de uso publico"
        v-model="holiday.public_name"
      ></q-input>
      <q-input
        filled
        required
        type="textarea"
        label="Descripcion"
        hint="Descripcion detallada. Uso publico & interno"
        v-model="holiday.description"
      ></q-input>
      <q-input
        filled
        v-model="holiday.date"
        label="Fecha"
        hint="Fecha del feriado"
        lazy-rules
        required
        mask="date"
        :rules="[
          value => value !== null ? true : 'Campo Obligatorio',
          'date'
        ]"
      >
        <template v-slot:append>
          <q-icon name="mdi-calendar" class="cursor-pointer">
            <q-popup-proxy>
              <q-date today-btn v-model="holiday.date" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-btn color="primary" type="submit">submit</q-btn>
      <q-btn color="secondary" flat type="reset">reset</q-btn>
      <q-inner-loading :showing="loading">
        <q-spinner></q-spinner>
      </q-inner-loading>
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'CreateHoliday',
  data () {
    return {
      loading: false,
      holiday: {
        public_name: '',
        private_name: '',
        description: '',
        date: null
      }
    }
  },
  methods: {
    reset () {
      this.holiday.public_name = ''
      this.holiday.private_name = ''
      this.holiday.description = ''
      this.holiday.date = null
    },
    submit () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Este registro no puede modificicarse luego de la creacion',
        persistent: true,
        cancel: true
      }).onOk(this.createHoliday)
    },
    async createHoliday () {
      const query = /* GraphQL */`mutation ($objects: [calendar_holiday_insert_input!]!) {
        insert: insert_calendar_holiday (objects: $objects) {
          affected_rows
          holidays: returning {
            id: holiday_id
            name: private_name
          }
        }
      }`

      const variables = {
        objects: this.holiday
      }

      try {
        this.loading = true

        const { insert: { holidays: [ { id, name } ] } } = await this.$gql(query, variables, { role: 'administrator' })

        this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `Tiempo de Vida ${name} Creado Exitosamente` })
        this.$router.push(`/holiday/${id}`)
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
