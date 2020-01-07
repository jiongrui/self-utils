<template>
  <div>
    <canvas
      class="canvas"
      id="canvas"
    ></canvas>
  </div>
</template>
<script>
import {example} from '../../utils/aStartSearchRoute2'
export default {
  data() {
    return {

    }
  },
  mounted() {
    const canvas = document.getElementById('canvas')
    const a = {x: 0, y: 1}
    example(a, {x: 6, y: 7}, canvas, true)

    // const a = {x: 0, y: 1}
    // example(a, {x: 10, y: 7})
    // example(a, {x: 7, y: 10})
    // example(a, {x: 4, y: 7})
    // example(a, {x: 7, y: 5})
    // example(a, {x: 6, y: 8})
    // example(a, {x: 8, y: 7})
  }
}
</script>
<style >
.canvas {
  width: 300px;
  height: 300px;
}
</style>
