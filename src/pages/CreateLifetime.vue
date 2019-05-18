<template>
  <q-page padding class="">
    <q-form @submit="submit" @reset="reset" autofocus class="q-gutter-md" style="max-width: 600px">
      <q-input
        filled
        label="Nombre Privado"
        hint="Nombre de uso interno"
        v-model="lifetime.private_name"
        lazy-rules
        :rules="[
          value => value && value.length > 0 ? true : 'Campo Obligatorio'
        ]"
      ></q-input>
      <q-input
        filled
        label="Nombre Publico"
        hint="Nombre de uso publico"
        v-model="lifetime.public_name"
        lazy-rules
        :rules="[
          value => value && value.length > 0 ? true : 'Campo Obligatorio'
        ]"
      ></q-input>
      <q-input
        filled
        type="textarea"
        label="Descripcion"
        hint="Descripcion detallada. Uso publico & interno"
        v-model="lifetime.description"
        lazy-rules
        :rules="[
          value => value && value.length > 0 ? true : 'Campo Obligatorio'
        ]"
      ></q-input>
      <q-input
        filled
        v-model="lifetime.start"
        label="Inicio de tiempo de vida"
        hint="El tiempo de vida sera valido a partir de esta fecha"
        lazy-rules
        mask="date"
        :rules="[
          value => value !== null ? true : 'Campo Obligatorio',
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
        label="Fin de tiempo de vida"
        hint="El tiempo de vida sera valido hasta esta fecha"
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
        hint="El tiempo de vida sera valido para estos dias"
        v-model="lifetime.lifetime_weekdays"
        :options="options.weekdays"
        multiple
        lazy-rules
        :rules="[
          value => value.length > 0 ? true : 'Debe selecionar algunos dias de validez'
        ]"
      ></q-select>

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
  name: 'CreateLifetime',
  data () {
    return {
      loading: false,
      options: {
        weekdays: []
      },
      lifetime: {
        public_name: '',
        private_name: '',
        description: '',
        lifetime_weekdays: [],
        start: null,
        end: null
      }
    }
  },
  methods: {
    reset () {
      this.lifetime.public_name = ''
      this.lifetime.private_name = ''
      this.lifetime.description = ''
      this.lifetime.lifetime_weekdays = []
      this.lifetime.start = null
      this.lifetime.end = null
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
            name: private_name
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

        this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `Tiempo de Vida ${name} Creado Exitosamente` })
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
          label: weekday_name
        }
      }`
      const variables = {}

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
