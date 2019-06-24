<template>
  <q-form @submit="submit" @reset="reset" class="q-gutter-y-md">
    <q-input
      filled
      required
      label="Nombre Privado"
      hint="Nombre de uso interno"
      v-model="lifetime.name"
      lazy-rules
      :rules="[
        value => value && value.length > 0 ? true : 'Campo Obligatorio'
      ]"
    ></q-input>
    <q-input
      filled
      required
      v-model="lifetime.start"
      label="Inicio de vigencia"
      hint="El vigencia sera valido a partir de esta fecha"
      lazy-rules
      mask="date"
      :rules="[
        'date'
      ]"
    >
      <template v-slot:append>
        <q-icon name="mdi-calendar" class="cursor-pointer">
          <q-popup-proxy>
            <q-date today-btn v-model="lifetime.start" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      filled
      v-model="lifetime.end"
      label="Fin de vigencia"
      hint="El vigencia sera valido hasta esta fecha"
      lazy-rules
      mask="date"
      :rules="[
        value => value !== null ? true : 'Campo Obligatorio',
        'date',
        value => lifetime.start !== null && new Date(value) >= new Date(lifetime.start) ? true : 'Fin de tiempo de validez debe ser igual o superio a inicio de validez'
      ]"
    >
      <template v-slot:append>
        <q-icon name="mdi-calendar" class="cursor-pointer">
          <q-popup-proxy>
            <q-date today-btn v-model="lifetime.end" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-select
      filled
      label="Dias de validez"
      hint="La vigencia sera valida para estos dias"
      v-model="lifetime.lifetime_weekdays"
      :options="options.weekdays"
      multiple
      lazy-rules
      :rules="[
        value => value.length > 0 ? true : 'Debe selecionar algunos dias de validez'
      ]"
    ></q-select>
    <q-checkbox v-model="lifetime.include_holidays" label="Incluye Feriados"></q-checkbox>

    <q-separator></q-separator>
    <div class="row justify-around q-pa-md">
      <q-btn color="secondary" flat type="reset">reset</q-btn>
      <q-btn color="primary" type="submit">Crear</q-btn>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-form>
</template>

<script>
export default {
  name: 'CreateLifetime',
  data () {
    return {
      loading: false,
      options: {
        weekdays: []
      },
      lifetime: {
        name: '',
        lifetime_weekdays: [],
        start: null,
        end: null,
        include_holidays: false
      }
    }
  },
  methods: {
    reset () {
      this.lifetime.name = ''
      this.lifetime.lifetime_weekdays = []
      this.lifetime.start = null
      this.lifetime.end = null
      this.lifetime.include_holidays = false
    },
    submit () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Este registro no puede modificicarse luego de la creacion',
        persistent: true,
        cancel: true
      }).onOk(this.createLifetime)
    },
    async createLifetime () {
      const query = /* GraphQL */`mutation ($objects: [calendar_lifetime_insert_input!]!) {
        insert: insert_calendar_lifetime (objects: $objects) {
          affected_rows
          lifetimes: returning {
            id: lifetime_id
            name
          }
        }
      }`

      const variables = {
        objects: {
          ...this.lifetime,
          lifetime_weekdays: {
            data: this.lifetime.lifetime_weekdays.map(({ value }) => ({ weekday_id: value }))
          }
        }
      }

      try {
        this.loading = true

        const { insert: { lifetimes: [ { id, name } ] } } = await this.$gql(query, variables, { role: 'administrator' })

        this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `Vigencia ${name} Creada Exitosamente` })
        this.$router.push(`/lifetime/${id}`)
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    },
    async loadOptions () {
      const query = /* GraphQL */`query {
        weekdays: calendar_weekday {
          value: weekday_id
          label: name
        }
      }`
      const variables = {
      }

      try {
        this.loading = true

        const { weekdays } = await this.$gql(query, variables, { role: 'administrator' })

        this.options.weekdays = weekdays
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadOptions()
  }
}
</script>
