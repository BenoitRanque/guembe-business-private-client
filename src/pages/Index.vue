<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/isologo.svg">
    <q-btn @click="$api('/csrftoken')">get csrf</q-btn>
    <q-btn @click="$store.dispatch('RESTORE_SESSION')">restore</q-btn>
    <pre>{{$store.state}}</pre>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex'
}
</script>
