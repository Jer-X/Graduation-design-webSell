<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        foodArr: []
      };
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    height: 100%
</style>
