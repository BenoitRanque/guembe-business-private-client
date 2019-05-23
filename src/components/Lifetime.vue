<template>
  <div class="text-bold">
    <div class="text-primary row justify-between">
      <span class="q-px-xs">
        {{lifetime.start.replace(/-/g, '/')}}
        <q-tooltip>
          Producto vigente desde fecha {{lifetime.start.replace(/-/g, '/')}}
        </q-tooltip>
      </span>
      <span class="q-px-xs text-body2 text-bold text-black">
        Vigencia
        <q-tooltip>
          Vigencia del producto
        </q-tooltip>
      </span>
      <span class="q-px-xs">
        {{lifetime.end.replace(/-/g, '/')}}
        <q-tooltip>
          Producto vigente hasta fecha {{lifetime.end.replace(/-/g, '/')}}
        </q-tooltip>
      </span>
    </div>
    <div class="text-grey row justify-between text-center">
      <span class="q-px-xs" :class="{ 'text-primary': includeWeekday(1) }">
        Lun
        <q-tooltip>
          Producto {{includeWeekday(1) ? '' : 'no'}} vigente los dias Lunes
        </q-tooltip>
      </span>
      <span class="q-px-xs" :class="{ 'text-primary': includeWeekday(2) }">
        Mar
        <q-tooltip>
          Producto {{includeWeekday(2) ? '' : 'no'}} vigente los dias Martes
        </q-tooltip>
      </span>
      <span class="q-px-xs" :class="{ 'text-primary': includeWeekday(3) }">
        Mie
        <q-tooltip>
          Producto {{includeWeekday(3) ? '' : 'no'}} vigente los dias Miercoles
        </q-tooltip>
      </span>
      <span class="q-px-xs" :class="{ 'text-primary': includeWeekday(4) }">
        Jue
        <q-tooltip>
          Producto {{includeWeekday(4) ? '' : 'no'}} vigente los dias Jueves
        </q-tooltip>
      </span>
      <span class="q-px-xs" :class="{ 'text-primary': includeWeekday(5) }">
        Vie
        <q-tooltip>
          Producto {{includeWeekday(5) ? '' : 'no'}} vigente los dias Viernes
        </q-tooltip>
      </span>
      <span class="q-px-xs" :class="{ 'text-primary': includeWeekday(6) }">
        Sab
        <q-tooltip>
          Producto {{includeWeekday(6) ? '' : 'no'}} vigente los dias Sabado
        </q-tooltip>
      </span>
      <span class="q-px-xs" :class="{ 'text-primary': includeWeekday(0) }">
        Dom
        <q-tooltip>
          Producto {{includeWeekday(0) ? '' : 'no'}} vigente los dias Domingo
        </q-tooltip>
      </span>
      <span class="q-px-xs" :class="{ 'text-primary': lifetime.include_holidays }">
        Feriados
        <q-tooltip>
          Producto {{lifetime.include_holidays ? '' : 'no'}} vigente los dias Feriados
        </q-tooltip>
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Lifetime',
  props: {
    lifetime: {
      type: Object,
      required: true
    }
  },
  methods: {
    includeWeekday (index) {
      return this.lifetime.lifetime_weekdays.some(({ weekday_id }) => weekday_id === index)
    }
  }
}
</script>
