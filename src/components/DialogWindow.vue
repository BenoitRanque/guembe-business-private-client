<template>
  <q-dialog
    :value="value"
    @input="update"
    :maximized="maximized && !minimized.state"
    persistent
    :seamless="minimized.state"
    :position="minimized.state ? 'bottom' : 'standard'"
    :content-class="minimized.state ? 'dialog-window-minimized' : null"
    :transition-hide="minimized.state ? 'slide-down' : 'scale'"
    @hide="reset"
  >
    <q-bar
      v-if="minimized.state"
      class="bg-primary text-white cursor-pointer rounded-borders overflow-hidden ellipsis"
      :style="`width: 250px; margin-left: ${250 * (minimized.slot === null ? 0 : minimized.slot)}px;`"
      @click="restore">
      <div class="ellipsis">
        {{title}}
      </div>
      <q-space />
      <q-btn-group flat>
        <q-btn flat icon="mdi-window-minimize" class="window-minimize" dense :disable="minimized.state"></q-btn>
        <q-btn flat dense :icon="`mdi-window-${maximized ? 'maximize' : 'restore'}`"></q-btn>
        <q-btn flat dense icon="mdi-close" v-close-popup @click.stop.prevent></q-btn>
      </q-btn-group>
    </q-bar>
    <q-layout v-else container view="hHh lpr fff" style="min-height: 30vh">
        <q-header>
          <q-bar>
            <div class="ellipsis">
              {{title}}
            </div>
            <q-space />
            <q-btn flat dense :icon="`mdi-window-minimize`" class="window-minimize" @click="minimize"></q-btn>
            <q-btn flat dense :icon="`mdi-window-${maximized ? 'restore' : 'maximize'}`" @click="toggle"></q-btn>
            <!-- <q-btn flat dense :icon="`mdi-arrow-${maximized ? 'collapse' : 'expand'}-all`" @click="maximized = !maximized"></q-btn> -->
            <q-btn flat dense icon="mdi-close" v-close-popup></q-btn>
          </q-bar>
        </q-header>

        <q-page-container>
          <q-page class="bg-white">
            <slot name="default"></slot>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
</template>

<script>
export default {
  name: 'DialogWindow',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      minimized: {
        state: false,
        slots: [],
        slot: null
      },
      maximized: false
    }
  },
  computed: {
    toggleIcon () {
      if (this.minimized.state) {
        return this.maximized ? 'maximize' : 'restore'
      }
      return this.maximized ? 'restore' : 'maximize'
    }
  },
  methods: {
    unbindSlot () {
      // when closed
      this.$root.$emit('DIALOG_WINDOW_RESTORED', this.minimized.slot)
      this.minimized.slot = null
    },
    bindSlot () {
      // when minimized
      this.minimized.slot = this.minimized.slots.sort((a, b) => a - b)
        .reduce((acc, slot, index) => slot !== index && index < acc ? index : acc, this.minimized.slots.lenght)

      this.$root.$emit('DIALOG_WINDOW_MINMIZED', this.minimized.slot)
    },
    onBindSlot (slotIndex) {
      console.log('binding slot', slotIndex)
      this.minimized.slots.push(slotIndex)
    },
    onUnbindSlot (slotIndex) {
      this.minimized.slots = this.minimized.slots.filter(slotValue => slotValue !== slotIndex)
    },
    reset () {
      this.maximized = false
      this.minimizedId = 0
      if (this.minimized.slot !== null) {
        this.unbindSlot()
      }
    },
    minimize () {
      this.bindSlot()
      this.minimized.state = true
    },
    restore () {
      this.minimized.state = false
      this.unbindSlot()
    },
    toggle () {
      if (this.minimized.state) {
        this.restore()
      } else {
        this.maximized = !this.maximized
      }
    },
    update (value) {
      this.$emit('input', value)
    }
  },
  created () {
    this.$root.$on('DIALOG_WINDOW_MINIMIZED', this.onBindSlot)
    this.$root.$on('DIALOG_WINDOW_RESTORED', this.onUnbindSlot)
  },
  beforeDestroy () {
    if (this.minimized.slot !== null) {
      this.unbindSlot()
    }
    this.$root.$off('DIALOG_WINDOW_MINIMIZED', this.onBindSlot)
    this.$root.$off('DIALOG_WINDOW_RESTORED', this.onUnbindSlot)
  }
}
</script>

<style lang="stylus">
  .q-btn.window-minimize .q-icon
    &:before
      margin-top 45%
      height 45%
  .q-dialog.dialog-window-minimized > .q-dialog__inner
    justify-content left
</style>
