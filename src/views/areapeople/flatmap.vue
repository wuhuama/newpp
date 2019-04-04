<template>
  <div class="3dMap-container">
    平面地图
    <button v-on:click="count++">You clicked me {{ count }} times.</button>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      count: 0
    }
  }
}
</script>