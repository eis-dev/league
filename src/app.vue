<template>
  <div id="app">
    <router-view :key="key" @reload="key = $event"></router-view>
  </div>
</template>

<script>

  export default {
    name: 'app',
    data() {
      return {
        key: 0
      }
    }
  }
</script>
